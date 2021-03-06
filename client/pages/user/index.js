import styles from '../../styles/Home.module.css';
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { API } from '../../config';
import withUser from '../withUser';
import Link from 'next/link';
import moment from 'moment';
import Router from 'next/router';
import Layout from '../../components/Layout';
import { isAuth } from '../../helpers/auth';

const User = ({ user, token, l, userLinks }) => {
  const [loaded, setLoaded] = useState(false);
  // console.log('userLinks', userLinks);
  // console.log(
  //   'userLinks',
  //   userLinks.sort(
  //     (a, b) => Date.parse(b.pickupDate) - Date.parse(a.pickupDate)
  //   )
  // );

  // const orderByDateUserLinks = userLinks.filter

  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const imageLoaded = () => setFirstImageLoaded(true);

  const firstImage = useCallback((firstImageNode) => {
    firstImageNode && firstImageNode.addEventListener('load', imageLoaded());
    return () => firstImageNode.removeEventListener('load', imageLoaded());
  }, []);

  useEffect(() => {
    return () => {
      setLoaded(true);
    };
  }, [firstImageLoaded]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoaded(true);
  //   }, 800);
  // }, []);

  const confirmDelete = (e, id) => {
    e.preventDefault();
    let answer = window.confirm(
      'ATENTION! Please cancel at least a week in advance of pickup date if possible.'
    );
    if (answer) {
      window.confirm('Request is cancelled. No further action required.');
      handleDelete(id);
    }
  };

  function printData(e) {
    let id = e.target.getAttribute('data-index');
    let divToPrint = document.getElementById(id);
    let css =
        'body { display: flex; flex-direction: column; align-items: center; justify-content: center;  } @page { size: landscape } .code { font-size: 10rem;}',
      head = document.createElement('head'),
      style = document.createElement('style');

    // style.type = 'text/css';
    // style.media = 'print';

    style.appendChild(document.createTextNode(css));
    head.appendChild(style);

    let newWin = window.open('');
    newWin.document.write(head.outerHTML, divToPrint.outerHTML);
    if (newWin == null || typeof newWin == 'undefined')
      alert('Turn off your pop-up blocker to print code');
    newWin.document.close();
    newWin.print();
    setTimeout(() => {
      newWin.close();
    }, 100);
    // }, 300);
  }

  useEffect(() => {
    !isAuth() && Router.push('/');
    user.students.length === 0 && Router.push('/user/profile/add');
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API}/link/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log('LINK DELETE SUCCESS', response);
      Router.replace('/user');
    } catch (error) {
      // console.log('ERROR DELETING LINK', error);
    }
  };

  const listOfLinks = () =>
    userLinks
      .sort((a, b) => Date.parse(a.pickupDate) - Date.parse(b.pickupDate))
      .map((l, i) => (
        <>
        <div className="container">
          {moment(l.pickupDate).format('MDD').toString() > // doesn't show receipts older than 3 days past pickupdate (actually mealweek date i need to change pickupdate to mealweek)
            moment(new Date()).subtract(2, 'day').format('MDD').toString() && (
            // <Link href={`/user/receipt/${l._id}`}>
            //   <a style={{ textDecoration: 'none' }}>
            <div
              key={i}
              // style={{ textDecoration: 'none' }}
              className={
                l.orderStatus === true ||
                moment(l.pickupDate).format('MDD').toString() <
                  moment(new Date())
                    .subtract(4, 'day')
                    .format('MDD')
                    .toString() ||
                l.pickupDate === moment('05/31/2021').format('l')
                  ? 'p-4 alert  alert-secondary ' + styles.subcard // completed order
                  : 'p-4 alert  alert-warning ' + styles.subcard //  active order
              }
            >
              {/* {console.log(
              'date comparison',
              moment(l.pickupDate).format('MDD').toString() <
                moment(new Date()).format('MDD').toString()
            )} */}
              <div className="wrapper ">
                <Link href={`/user/receipt/${l._id}`}>
                  <a
                    className=" "
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    <h4>
                      {l.orderStatus && (
                        <b className="text-danger ">
                          <h2>
                            * PICKED UP *
                            <br />
                            on {moment(l.updatedAt).format('MMM Do')}
                          </h2>
                          <hr />
                        </b>
                      )}
                      {
                        // 1 < 1
                      }
                      {moment(l.pickupDate).format('MDD').toString() <
                        moment(new Date())
                          // .add(2, 'day') // add 2 expires the reciept saturday when pickup(weekof) is monday
                          .subtract(4, 'day')
                          .format('MDD')
                          .toString() && (
                        <b className="text-danger ">
                          <h2>
                            * EXPIRED *
                            <br />
                            {/* on {moment(l.updatedAt).format('MMM Do')} */}
                          </h2>
                          <hr />
                        </b>
                      )}
                    </h4>

                    {l.mealRequest.filter(
                      // If any of these are true, display as a curbside pickup
                      (l) =>
                        l.meal == 'Standard' ||
                        l.meal == 'Vegetarian' ||
                        l.meal == 'Gluten Free' ||
                        l.meal == 'Vegan' ||
                        l.meal == 'Standard Dairy Free' ||
                        l.meal == 'GlutenFree Dairy Free' ||
                        l.pickupOption === 'Lunch Onsite / Breakfast Pickup' ||
                        l.pickupOption ===
                          'Two Onsite / Three Breakfast and Lunches' ||
                        l.pickupOption === 'Lunch Only' ||
                        l.pickupOption === 'Breakfast and Lunch' ||
                        l.pickupOption === 'Breakfast Only'
                    ).length != 0 && (
                      <React.Fragment>
                        {l.pickupDate ===
                        moment('05/31/2021').format('l') ? null : (
                          <h3 className="pt-2 d-flex justify-content-center ">
                            CURBSIDE PICKUP
                          </h3>
                        )}
                        <h4>
                          <div className="d-flex justify-content-center">
                            {/* {'On '} */}
                            {l.pickupDate ===
                            moment('05/31/2021').format('l') ? (
                              <>
                                <b className="text-center text-danger">
                                  The pickup for 
                                  <br />
                                  {moment(l.pickupDate) // if pickupdate is certain date then subtract certain days. I can hard code some of that.
                                    .subtract(3, 'day') // i can make the number a variable that is set in the menu creation phase or something
                                    .format('dddd MMMM Do')} 
                                    <br />
                                    has been
                                  <br />
                                  <b className="text-center">CANCELLED</b>
                                </b>
                              </>
                            ) : (
                              <b>
                                {moment(l.pickupDate) // if pickupdate is certain date then subtract certain days. I can hard code some of that.
                                  .subtract(3, 'day') // i can make the number a variable that is set in the menu creation phase or something
                                  .format('dddd MMMM Do')}
                              </b>
                            )}
                          </div>
                        </h4>
                        <span className="d-flex justify-content-center ">
                          <b className="pb-2 ">{'Between ' + l.pickupTime} </b>
                        </span>
                      </React.Fragment>
                    )}
                    <hr className={styles.hr} />

                    <h3>
                      {l.mealRequest.filter(
                        // decides to display print code
                        (l) =>
                          l.meal == 'Standard' ||
                          l.meal == 'Vegetarian' ||
                          l.meal == 'GlutenFree' ||
                          l.meal == 'Vegan' ||
                          l.meal == 'Standard DF' ||
                          l.meal == 'GlutenFree DF' ||
                          l.pickupOption ===
                            'Lunch Onsite / Breakfast Pickup' ||
                          l.pickupOption ===
                            'Two Onsite / Three Breakfast and Lunches' ||
                          l.pickupOption === 'Lunch Only' ||
                          l.pickupOption === 'Breakfast Only' ||
                          l.pickupOption === 'Breakfast and Lunch'
                      ).length != 0 ? (
                        <b
                          id={`${i}+printCode`}
                          data-index={`${i}+printCode`}
                          onClick={
                            l.orderStatus === false &&
                            moment(l.pickupDate).format('MDD').toString() >
                              moment(new Date()).format('MDD').toString()
                              ? (e) => printData(e)
                              : null
                          }
                          className="code d-flex justify-content-center"
                        >
                          {l.pickupCode}{' '}
                        </b>
                      ) : (
                        <b>
                          Onsite School Lunch for Week of{' '}
                          {moment(l.pickupDate).format('MMMM Do')}
                          {/* {moment(l.pickupDate).add(3, 'day').format('MMMM Do')} */}
                        </b>
                      )}
                    </h3>

                    <hr className={styles.hr} />
                    {l.mealRequest.filter(
                      // decides to show instructions
                      (l) =>
                        l.meal == 'Standard' ||
                        l.meal == 'Vegetarian' ||
                        l.meal == 'GlutenFree' ||
                        l.meal == 'Vegan' ||
                        l.meal == 'Standard DF' ||
                        l.meal == 'GlutenFree DF' ||
                        l.pickupOption === 'Lunch Onsite / Breakfast Pickup' ||
                        l.pickupOption ===
                          'Two Onsite / Three Breakfast and Lunches' ||
                        l.pickupOption === 'Breakfast Only' ||
                        l.pickupOption === 'Lunch Only' ||
                        l.pickupOption === 'Breakfast and Lunch'
                    ).length != 0 && (
                      <h6>
                        Pickup is at{' '}
                        <b className="text">Brookside Elementary</b>. Display
                        the above code{' '}
                        <b className="text-danger">on your dashboard </b>or show
                        from your phone.
                      </h6>
                    )}
                    <p></p>
                  </a>
                </Link>
              </div>{' '}
              {/* finish wrapper  */}
              <div className="">
                {/* put link router here  */}

                <div className="p-2">
                  <Link href={`/user/receipt/${l._id}`}>
                    <a style={{ color: 'inherit', textDecoration: 'none' }}>
                      <h5 className="pb-1">
                        <div className="p-3">
                          {l.mealRequest
                            .filter((l) => l.meal !== 'None')
                            .map((k, i) => (
                              <>
                                <h5 className="">
                                  <b>
                                    {k.student === undefined
                                      ? 'user deleted'
                                      : l.postedBy.students.filter((student) =>
                                          student._id.includes(k.student)
                                        ) && k.studentName}
                                    :
                                  </b>
                                  <br></br>
                                </h5>
                                {k.student === undefined ? (
                                  'user deleted'
                                ) : k.group === 'a-group' ||
                                  k.group === 'b-group' ? (
                                  k.pickupOption ===
                                  'Lunch Onsite / Breakfast Pickup' ? (
                                    <>
                                      <div className="p-1">
                                        <div className="pb-2 ">
                                          Curbside Breakfast{' '}
                                        </div>
                                        <div
                                          className="p-2"
                                          style={{ fontSize: '16px' }}
                                        >
                                          PLUS:
                                          <br />
                                          *Onsite Lunches{' '}
                                          {k.group === 'b-group'
                                            ? '- B'
                                            : k.group === 'a-group'
                                            ? '- A'
                                            : ''}
                                          *
                                          <br />
                                          *Week of{' '}
                                          {moment(l.pickupDate)
                                            // .add(3, 'day')
                                            .format('MMMM Do')}
                                          *
                                        </div>
                                      </div>
                                    </>
                                  ) : k.pickupOption ===
                                    'Two Onsite / Three Breakfast and Lunches' ? (
                                    <>
                                      <div className="p-1">
                                        <div className="pb-2 ">
                                          Curbside: Three Lunches and Five
                                          Breakfasts
                                        </div>
                                        <div
                                          className="p-2"
                                          style={{ fontSize: '16px' }}
                                        >
                                          PLUS:
                                          <br />
                                          *Onsite Lunches{' '}
                                          {k.group === 'b-group'
                                            ? '- B'
                                            : k.group === 'a-group'
                                            ? '- A'
                                            : ''}
                                          *
                                          <br />
                                          *Week of{' '}
                                          {moment(l.pickupDate)
                                            // .add(3, 'day')
                                            .format('MMMM Do')}
                                          *
                                          <br />
                                          {k.days && k.days.monday && (
                                            <>
                                              *Monday*
                                              <br />
                                            </>
                                          )}
                                          {k.days && k.days.tuesday && (
                                            <>
                                              *Tuesday*
                                              <br />
                                            </>
                                          )}
                                          {k.days && k.days.wednesday && (
                                            <>
                                              *Wednesday*
                                              <br />
                                            </>
                                          )}
                                          {k.days && k.days.thursday && (
                                            <>
                                              *Thursday*
                                              <br />
                                            </>
                                          )}
                                          {k.days && k.days.friday && (
                                            <>
                                              *Friday*
                                              <br />
                                            </>
                                          )}
                                          {/* TYPE:
                                        <br />
                                        {k.pickupOption} */}
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="p-1">
                                        Onsite Lunches
                                        <br />
                                        <div
                                          className="p-2"
                                          style={{ fontSize: '16px' }}
                                        >
                                          *
                                          {k.group === 'b-group'
                                            ? 'Cohort B'
                                            : k.group === 'a-group'
                                            ? 'Cohort A'
                                            : ''}
                                          * <br />
                                          *Week of{' '}
                                          {moment(l.pickupDate)
                                            // .add(3, 'day')
                                            .format('MMMM Do')}
                                          *
                                          <br />
                                          {k.days && k.days.monday && (
                                            <>
                                              *Monday*
                                              <br />
                                            </>
                                          )}
                                          {k.days && k.days.tuesday && (
                                            <>
                                              *Tuesday*
                                              <br />
                                            </>
                                          )}
                                          {k.days && k.days.wednesday && (
                                            <>
                                              *Wednesday*
                                              <br />
                                            </>
                                          )}
                                          {k.days && k.days.thursday && (
                                            <>
                                              *Thursday*
                                              <br />
                                            </>
                                          )}
                                          {k.days && k.days.friday && (
                                            <>
                                              *Friday*
                                              <br />
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  )
                                ) : (
                                  <>
                                    <div className="p-1">
                                      Curbside: {k.meal}{' '}
                                      <div
                                        className="p-2"
                                        style={{ fontSize: '16px' }}
                                      >
                                        TYPE:
                                        <br />
                                        {k.pickupOption}
                                      </div>
                                    </div>
                                  </>
                                )}
                                <hr />
                              </>
                            ))}
                        </div>
                      </h5>
                    </a>
                  </Link>
                </div>
                {l.mealRequest.filter(
                  // decides to show reheat instructions
                  (l) =>
                    l.meal == 'Standard' ||
                    l.meal == 'Vegetarian' ||
                    l.meal == 'Gluten Free' ||
                    l.meal == 'Vegan' ||
                    l.meal == 'Standard Dairy Free' ||
                    l.meal == 'GlutenFree Dairy Free' ||
                    l.pickupOption === 'Lunch Onsite / Breakfast Pickup' ||
                    l.pickupOption ===
                      'Two Onsite / Three Breakfast and Lunches' ||
                    l.pickupOption === 'Lunch Only' ||
                    l.pickupOption === 'Breakfast and Lunch'
                ).length != 0 && (
                  <div className=" d-flex justify-content-center ">
                    <Link
                      href={`https://drive.google.com/drive/folders/1rF6PSME6_yyWIdsmIhWng8x2Wo2xt4h9`}
                    >
                      <a target="_blank">
                        <button
                          className="btn btn-sm btn-outline-dark text float-left"
                          style={{
                            // boxShadow: '0 3px 3px 0 rgba(0, 0, 0, 0.2)',
                            fontSize: '20px',
                          }}
                        >
                          <i
                            className="text-warning fas fa-fire"
                            style={{
                              // boxShadow: '0 3px 3px 0 rgba(0, 0, 0, 0.2)',
                              fontSize: '20px',
                            }}
                          ></i>{' '}
                          &nbsp;Reheating Instructions
                        </button>
                      </a>
                    </Link>
                  </div>
                )}

                <div className="p-3"></div>
                <div style={{ fontSize: '12px' }}>
                  Receipt for week of{' '}
                  <b>Monday {moment(l.pickupDate).format('MMMM Do')}</b>
                  {/* put link router here  */}
                </div>

                <div style={{ fontSize: '12px' }} className=" pb-3 pt-3">
                  {
                    // l.postedBy.students[i] === undefined ? null :
                    // 10 > 1
                    l.orderStatus === false &&
                      moment(l.pickupDate).format('MDD').toString() >
                        moment(new Date())
                          .add(2, 'day') // add to push edit date further back (9) is a week before
                          // .subtract(4, 'day')
                          .format('MDD')
                          .toString() && (
                        <Link href={`/user/link/${l._id}`}>
                          <button className="btn btn-sm btn-outline-dark text float-left">
                            <i class="far fa-edit"></i> &nbsp;Edit
                          </button>
                        </Link>
                      )
                  }
                  <span>&nbsp;&nbsp;</span>
                  {l.orderStatus === false &&
                    l.mealRequest.filter(
                      // shows print code
                      (l) =>
                        l.meal == 'Standard' ||
                        l.meal == 'Vegetarian' ||
                        l.meal == 'GlutenFree' ||
                        l.meal == 'Vegan' ||
                        l.meal == 'Standard DF' ||
                        l.meal == 'GlutenFree DF' ||
                        l.pickupOption === 'Lunch Onsite / Breakfast Pickup' ||
                        l.pickupOption ===
                          'Two Onsite / Three Breakfast and Lunches' ||
                        l.pickupOption === 'Lunch Only' ||
                        l.pickupOption === 'Breakfast and Lunch'
                    ).length != 0 &&
                    moment(l.pickupDate).format('MDD').toString() >
                      moment(new Date()).format('MDD').toString() && (
                      <a>
                        <button
                          type="button"
                          // ref={printEl}
                          className="btn btn-sm btn-outline-dark text  print"
                          data-index={`${i}+printCode`}
                          onClick={(e) => printData(e)}
                        >
                          <i class="fas fa-print"></i>
                          &nbsp;Print Code
                        </button>
                      </a>
                    )}
                  {l.orderStatus === false &&
                    moment(l.pickupDate).format('MDD').toString() >
                      moment(new Date()).format('MDD').toString() && (
                      <Link href="">
                        <button
                          onClick={(e) => confirmDelete(e, l._id)}
                          className="text-white btn btn-sm btn-danger float-right"
                        >
                          Cancel
                        </button>
                      </Link>
                    )}
                  <div className="pt-3 ">
                    <span className="">
                      {' '}
                      Requested {moment(l.createdAt).format('l')} by{' '}
                      {l.postedBy == null ? 'user deleted' : l.postedBy.name}{' '}
                      <br />
                    </span>
                  </div>
                  <div className="pb-2"></div>
                </div>
              </div>
            </div>
          )}
          </div>
        </>
      ));

  return (
    <div className='container pt-5'>
      <Layout>
        <div className='pt-3'>
          <h2 className=" pt-3">{user.name}'s Receipts </h2>
          <hr />
          <div className="p-1">
            <div className="">
              <Link href="/user/profile/update">
                <button className={'btn btn-outline-secondary '}>
                  <i class="fas fa-user-alt"></i>
                  &nbsp;&nbsp; Profile Update
                </button>
                {/* <a className="nav-item">Profile Update</a> */}
              </Link>

              <Link href="/user/link/create">
                <button className={'btn float-right ' + styles.button}>
                  <i class="fas fa-pencil-alt"></i>
                  &nbsp;&nbsp; Meal Request
                </button>
              </Link>
            </div>
          </div>
          <br />

          <div className={'d-flex justify-content-center  ' + styles.desktop}>
            <div
              className={'col-md-5  justify-content-center ' + styles.desktop}
            >
              <br />

              <div className="pb-3">
                <br />
              </div>

              {loaded ? (
                listOfLinks()
              ) : (
                <>
                  <div className={'d-flex justify-content-center  '}>
                    <div className="col-md-12">
                      <div className="p-2"></div>
                      &nbsp;
                      <div className={' p-5 ' + styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                    </div>
                  </div>
                  <div className="p-4"></div>

                  <div
                    className={
                      'd-flex justify-content-center  ' + styles.desktop
                    }
                  >
                    <div className="col-md-12">
                      <div className={'p-5 ' + styles.animatedBg}>&nbsp;</div>
                      <div className="p-2"></div>
                      &nbsp;
                      <div className={styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div class={'' + styles.mobile}>
          <div className="flex-column justify-content-center ">
            <br />
            <div className="pb-3">
              <br />
              {loaded ? (
                listOfLinks()
              ) : (
                <>
                  <div className={'d-flex justify-content-center  '}>
                    <div className="col-md-8">
                      <div className="p-2"></div>
                      &nbsp;
                      <div className={' p-5 ' + styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                    </div>
                  </div>
                  <div className="p-4"></div>

                  <div
                    className={
                      'd-flex justify-content-center  ' + styles.desktop
                    }
                  >
                    <div className="col-md-8">
                      <div className={'p-5 ' + styles.animatedBg}>&nbsp;</div>
                      <div className="p-2"></div>
                      &nbsp;
                      <div className={styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                    </div>
                  </div>
                  <img
                ref={firstImage}
                hidden
                src="https://oakfoods.s3.us-east-2.amazonaws.com/Food+app+images/Food+app+images/step3b.png"
                // loading="lazy"
                alt=""
                class="stepimage"
                width="320"
              />
                </>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default withUser(User);
