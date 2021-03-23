import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import styles from '../../../styles/Home.module.css';
import axios from 'axios';
import Link from 'next/link';
import { API } from '../../../config';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import withAdmin from '../../withAdmin';
import { getCookie } from '../../../helpers/auth';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CSVLink } from 'react-csv';

const Requests = ({ token }) => {
  const [completeDate, setCompleteDate] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showStatus, setShowStatus] = useState(true);
  const [skip, setSkip] = useState(0);
  const [loadmeals, setLoadmeals] = useState(false);
  const [orderStatus, setOrderStatus] = useState(Boolean);
  const [state, setState] = useState({
    pickupDateLookup: moment(new Date()).format('l'),
    loadedUsers: [],
    orderStatusArray: [],
    allMealsArray: [],
    search: '',
    orderType: 'Pickup',
    linksByDateFiltered: [],
    searchByStatus: '',
    searchBySchool: '',
    searchByGroup: '',
    searchPickupTime: '',
    searchByTeacher: '', // this will return everything because it's empty
    searchByTeacher2: 'filter', // used to defualt to a searchword that wouldn't return anything
    searchByTeacher3: 'filter', // used to defualt to a searchword that wouldn't return anything
    searchByTeacher4: 'filter', // used to defualt to a searchword that wouldn't return anything
    ageGroup1: '',
    ageGroup2: '',
    ageGroup3: '',
    ageGroup4: '',
    error: '',
    success: '',
  });
  const [linksByDate, setLinksByDate] = useState([]);
  const [allMealsArray, setAllMealsArray] = useState([]);

  const {
    orderType,
    searchBySchool,
    searchByGroup,
    searchByTeacher,
    searchByTeacher2,
    searchByTeacher3,
    searchByTeacher4,
    ageGroup1,
    ageGroup2,
    ageGroup3,
    ageGroup4,
    linksByDateFiltered,
    pickupDateLookup,
    loadedUsers,
    searchByStatus,
    orderStatusArray,
    searchPickupTime,
    search,
  } = state;

  useEffect(() => {
    loadUsers();
    handleDateChange(pickupDateLookup);
  }, []);

  useEffect(() => {
    orderType === 'Onsite' ? setShowStatus(false) : setShowStatus(true);
  }, [orderType]);

  useEffect(() => {
    let allMealsArray2 = [];
    linksByDate.map((r, i) =>
      r.mealRequest.map((meal) => allMealsArray2.push(meal))
    );
    setAllMealsArray(allMealsArray2.filter((meal) => meal.meal !== 'None'));
  }, [linksByDate]);

  const loadUsers = async () => {
    const response = await axios.get(`${API}/user-list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setState({ ...state, loadedUsers: response.data });
  };
  // change date
  const onDateChange = (pickupDate) => {
    setState({ ...state, pickupDateLookup: moment(pickupDate).format('l') });
    handleDateChange(pickupDate);
    setShowSearch(!showSearch);
  };

  const handleDateChange = async (pickupDate) => {
    const pickupDateLookup = moment(pickupDate).format('l');
    const response = await axios.post(
      `${API}/links-by-date`,
      { pickupDateLookup },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setLinksByDate(response.data);

    compileOrderStatusArray(pickupDate);
  };

  const compileOrderStatusArray = (pickupDate) => {
    setState({
      ...state,
      linksByDateFiltered: linksByDate,
      pickupDateLookup: pickupDate,
    });
  };

  const handleDisabledDates = ({ date, view }) => date.getDay() !== 5;

  let twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 12);

  const handleSearch = (name, search, searchPickupTime, searchByStatus) => (
    e
  ) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: '',
      success: '',
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API}/link/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('LINK DELETE SUCCESS', response);
      process.browser && window.location.reload();
    } catch (error) {
      console.log('ERROR LINK CATEGORY', error);
    }
  };

  const confirmDelete = (e, id) => {
    e.preventDefault();
    let answer = window.confirm('WARNING! Confirm delete.');
    if (answer) {
      handleDelete(id);
    }
  };

  let csvOffsiteData = [];
  useEffect(() => {
    let allergiesList = [];
    let newList = [];

    csvOffsiteData = linksByDate
      .filter((l) => l.pickupTime.includes(searchPickupTime))
      .filter((l) => l.pickupTime != 'Cafeteria')
      .filter((l) => l.orderStatus.toString().includes(searchByStatus))
      .filter((l) => l.pickupCode.toLowerCase().includes(search.toLowerCase()));
  }, [linksByDate]);

  const csvOnsiteData = allMealsArray
    .filter((l) => l.group != 'distance-learning')
    .filter(
      (l, i) =>
        l.teacher.includes(searchByTeacher) ||
        l.teacher.includes(searchByTeacher2) ||
        l.teacher.includes(searchByTeacher3) ||
        l.teacher.includes(searchByTeacher4)
    )
    .filter((l, i) => l.group.includes(searchByGroup))
    .filter((l, i) => l.schoolName.includes(searchBySchool));

  const onsiteHeaders = [
    { label: 'School Name', key: 'schoolName' },
    { label: 'Student Name', key: 'studentName' },
    { label: 'Last Name', key: 'lastName' },
    { label: 'Teacher', key: 'teacher' },
    { label: 'Group', key: 'group' },
    { label: 'Food Allergy', key: 'foodAllergy' },
    { label: 'Complete', key: 'complete' },
  ];

  const pickupHeaders = [
    { label: 'Code', key: 'pickupCode' },
    { label: 'Pickup Time', key: 'pickupTime' },
    { label: 'Pickup Date', key: 'pickupDate' },
    { label: 'First Name', key: 'postedBy.name' },
    { label: 'Last Name', key: 'postedBy.lastName' },
  ];

  const handleComplete = async (id, orderStatus, mealRequest) => {
    try {
      const response = await axios.put(
        `${API}/link/admin/complete/${id}`,
        { orderStatus, mealRequest },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('MEAL COMPLETE SUCCESS', response);
    } catch (error) {
      console.log('ERROR MEAL CATEGORY', error.response.data.error);
    }
  };

  const handleIndividualComplete = async (id, orderStatus, mealRequest) => {
    try {
      const response = await axios.put(
        `${API}/link/admin/complete/${id}`,
        { orderStatus, mealRequest },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('MEAL COMPLETE SUCCESS', response);
    } catch (error) {
      console.log('ERROR MEAL CATEGORY', error.response.data.error);
    }
  };

  const changeOrderStatus = (e, mealRequest) => {
    const id = e.target.getAttribute('data-index');

    let requests = [...linksByDate];
    let requestById = '';
    for (let i = 0; i < requests.length; i++) {
      if (requests[i]._id === id) requestById = requests[i];
    }

    let request = { ...requestById };
    let answer = '';

    request.orderStatus === false
      ? (answer = window.confirm('Mark this order as completed?'))
      : (answer = window.confirm('Mark this order as not completed?'));
    if (answer) {
      request.orderStatus =
        e.target.type === 'checkbox' ? e.target.checked : e.target.value;

      for (let i = 0; i < requests.length; i++) {
        if (requests[i]._id === id) requests[i] = request;
      }

      requests.forEach((mealRequest) => {
        if (mealRequest.group === 'distance-learning') {
          mealRequest.complete = request.orderStatus;
        }
      });
      handleIndividualComplete(
        request._id,
        request.orderStatus,
        request.mealRequest
      );
      setLinksByDate(requests);
    }
  };

  const changeIndividualOrderStatus = (e, mealRequest) => {
    const id = e.target.getAttribute('data-index');

    let requests = [...allMealsArray];
    let requestById = '';
    for (let i = 0; i < requests.length; i++) {
      if (requests[i]._id === id) requestById = requests[i];
    }

    let request = { ...requestById };
    let answer = '';

    request.complete === false
      ? (answer = window.confirm('Mark this order as completed?'))
      : (answer = window.confirm('Mark this order as not completed?'));
    if (answer) {
      request.complete =
        e.target.type === 'checkbox' ? e.target.checked : e.target.value;

      // putting request back into shallow copy
      for (let i = 0; i < requests.length; i++) {
        if (requests[i]._id === id) requests[i] = request;
      }

      // handles individual meals orderstatus for every mealrequest
      requests.forEach((mealRequest) => {
        if (mealRequest.group === 'distance-learning') {
          mealRequest.complete = request.orderStatus;
        }
      });
      console.log(request);
      handleComplete(request._id, request.complete, request.mealRequest);
      setAllMealsArray(requests);
      // setState({ ...state, orderStatusArray: statuses });
    }
  };

  const listOfLinks = (search, searchPickupTime, searchByStatus) => (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">Code</th>
          <th scope="col">Student Info</th>
          {showStatus && <th scope="col">Status</th>}
        </tr>
      </thead>
      <tbody>
        {linksByDate
          .filter((l) => l.pickupTime.includes(searchPickupTime))
          .filter((l) => l.pickupTime != 'Cafeteria')
          .filter((l) => l.orderStatus.toString().includes(searchByStatus))
          .filter((l) =>
            l.pickupCode.toLowerCase().includes(search.toLowerCase())
          )
          .map((l, i) => (
            <>
              <tr key={i}>
                <td>
                  <Link href={`/user/receipt/${l._id}`}>
                    <a className="text-dark">{l.pickupCode}</a>
                  </Link>
                </td>
                <td>
                  {l.postedBy === null
                    ? 'user deleted'
                    : l.postedBy.students.map((s) => (
                        <>
                          {s.name} {s.schoolName} {','}{' '}
                        </>
                      ))}
                </td>
                {showStatus && (
                  <td>
                    <input
                      data-index={l._id}
                      type="checkbox"
                      onChange={(e) => changeOrderStatus(e, l)}
                      checked={l.orderStatus}
                    ></input>
                  </td>
                )}
              </tr>
            </>
          ))}
      </tbody>
    </table>
  );

  const listOfOnsiteLinks = (search, searchPickupTime, searchByStatus) => (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">Student</th>
          <th scope="col">Teacher</th>
          <th scope="col">School</th>
          <th scope="col">Group</th>
          {showStatus && <th scope="col">Status</th>}
        </tr>
      </thead>
      <tbody>
        {allMealsArray
          .filter((l) => l.group != 'distance-learning')
          .filter(
            (l, i) =>
              l.teacher.includes(searchByTeacher) ||
              l.teacher.includes(searchByTeacher2) ||
              l.teacher.includes(searchByTeacher3) ||
              l.teacher.includes(searchByTeacher4)
          )
          .filter((l, i) => l.group.includes(searchByGroup))
          .filter((l, i) => l.schoolName.includes(searchBySchool))

          .map((l, i) => (
            <>
              {console.log(l)}
              <tr key={i}>
                <td>
                  {l.postedBy === null
                    ? 'user deleted'
                    : l.studentName + ' ' + l.lastName}
                </td>
                <td>{l.postedBy === null ? 'user deleted' : l.teacher}</td>
                <td>{l.schoolName === null ? 'user deleted' : l.schoolName}</td>
                <td>
                  {l.postedBy === null
                    ? 'None'
                    : l.group === 'a-group'
                    ? 'A'
                    : l.group === 'b-group'
                    ? 'B'
                    : l.group}
                </td>
                {showStatus && (
                  <td>
                    <input
                      data-index={l._id}
                      type="checkbox"
                      onChange={(e) => changeIndividualOrderStatus(e, l)}
                      checked={l.complete}
                    ></input>
                  </td>
                )}
              </tr>
            </>
          ))}
      </tbody>
    </table>
  );

  const addBESTeacher = (teacherGroup) => (
    <>
      <div key={17} className="">
        <div className="">
          <select
            type="select"
            onChange={handleSearch(teacherGroup)}
            className="btn btn-sm btn-outline-primary"
            required
          >
            {' '}
            <option selected disabled value="">
              Choose Teacher
            </option>
            ,<option value="k-annino/lee">K - Annino/Lee</option>
            <option value="k-milbourn">K - Milbourn</option>
            <option value="1st-hirano">1st - Hirano</option>
            <option value="1st-morrow">1st - Morrow</option>
            <option value="2nd-watson">2nd - Watson</option>
            <option value="2nd-gerin">2nd - Gerin</option>
            <option value="3rd-squire">3rd - Squire</option>
            <option value="3rd-altman">3rd - Altman</option>
            <option value="3rd-rosenblum">3rd - Rosenblum</option>
            <option value="4th-keane">4th - Keane</option>
            <option value="4th-farlow">4th - Farlow</option>
            <option value="5th-stephens">5th - Stephens</option>
            <option value="5th-becker">5th - Becker</option>
            <option value="5th-powers">5th - Powers</option>
          </select>
        </div>
      </div>
    </>
  );

  const addOHESTeacher = (teacherGroup) => (
    <>
      <div key={16} className="">
        <div className="">
          <select
            type="select"
            onChange={handleSearch(teacherGroup)}
            className="btn  btn-sm btn-outline-primary"
            required
          >
            {' '}
            <option selected disabled value="">
              Choose Teacher
            </option>
            ,<option value="k-sloan">K - Sloan</option>
            <option value="k-foy">K - Foy</option>
            <option value="1st-aaronson">1st - Aaronson</option>
            <option value="1st-bretzing">1st - Bretzing</option>
            <option value="2nd-lieberman">2nd - Lieberman</option>
            <option value="2nd-ruben">2nd - Ruben</option>
            <option value="3rd-arnold">3rd - Arnold</option>
            <option value="4th-lockrey">4th - Lockrey</option>
            <option value="4th-farlow">4th - Farlow</option>
            <option value="4th-chobanian">4th - Chobanian</option>
            <option value="5th-bailey">5th - Bailey</option>
          </select>
        </div>
      </div>
    </>
  );

  const addROESTeacher = (teacherGroup) => (
    <>
      <div key={15} className="">
        <div className="">
          <select
            type="select"
            onChange={handleSearch(teacherGroup)}
            className="btn  btn-sm btn-outline-primary"
            required
          >
            {' '}
            <option selected disabled value="">
              Choose Teacher
            </option>
            ,<option value="k-lobianco">K - LoBianco</option>
            <option value="1st-bird">1st - Bird</option>
            <option value="1st-ewing">1st - Ewing</option>
            <option value="1st-holland">1st - Holland</option>
            <option value="2nd-mcdowell">2nd - McDowell</option>
            <option value="2nd-share">2nd - Share</option>
            <option value="3rd-cantillon">3rd - Cantillon</option>
            <option value="3rd-strong">3rd - Strong</option>
            <option value="4th-duffy">4th - Duffy</option>
            <option value="4th-matthews">4th - Matthews</option>
            <option value="5th-bodily">5th - Bodily</option>
            <option value="5th-cass">5th - Cass</option>
          </select>
        </div>
      </div>
    </>
  );
  const addMCMSTeacher = (teacherGroup) => (
    <>
      <div key={14} className="">
        <div className="">
          <select
            type="select"
            onChange={handleSearch(teacherGroup)}
            className=" btn  btn-sm btn-outline-primary"
            required
          >
            {' '}
            <option selected disabled value="">
              Choose Grade Level
            </option>
            ,<option value="6th-grade">6th grade </option>
            <option value="7th-grade">7th grade </option>
            <option value="8th-grade">8th grade </option>
          </select>
        </div>
      </div>
    </>
  );

  const addOPHSTeacher = (teacherGroup) => (
    <>
      <div key={13} className="">
        <div className="">
          <select
            type="select"
            onChange={handleSearch(teacherGroup)}
            className=" btn  btn-sm btn-outline-primary"
            required
          >
            {' '}
            <option selected disabled value="">
              Choose Grade Level
            </option>
            ,<option value="9th-grade">9th grade</option>
            <option value="10th-grade">10th grade </option>
            <option value="11th-grade">11th grade </option>
            <option value="12th-grade">12th grade </option>
          </select>
        </div>
      </div>
    </>
  );

  const addOODTeacher = (teacherGroup) => (
    <>
      <div key={12} className="">
        <div className="">
          <select
            type="select"
            onChange={handleSearch(teacherGroup)}
            className=" btn  btn-sm btn-outline-primary"
          >
            {' '}
            <option selected disabled value="">
              Choose Grade Level
            </option>
            ,<option value="9th-grade">9th grade</option>
            <option value="10th-grade">10th grade </option>
            <option value="11th-grade">11th grade </option>
            <option value="12th-grade">12th grade </option>
          </select>
        </div>
      </div>
    </>
  );
  const addNONTeacher = (teacherGroup) => (
    <>
      <div key={11} className="">
        <div className="">
          <select
            type="select"
            onChange={handleSearch(teacherGroup)}
            className=" btn  btn-sm btn-outline-primary"
          >
            {' '}
            <option selected disabled value="">
              Choose Grade Level
            </option>
            ,<option value="9th-grade">9th grade</option>
            <option value="10th-grade">10th grade </option>
            <option value="11th-grade">11th grade </option>
            <option value="12th-grade">12th grade </option>
          </select>
        </div>
      </div>
    </>
  );

  const resetSearch = () => {
    setState({
      ...state,
      searchByGroup: '',
      searchBySchool: '',
      searchByTeacher: '',
      searchByTeacher2: 'filter',
      searchByTeacher3: 'filter',
      searchByTeacher4: 'filter',
      searchPickupTime: '',
    });
  };

  const handleObjectAgeChange = (ageGroup) => (e) => {
    setState({
      ...state,
      [ageGroup]: e.target.value,
      error: '',
      success: '',
      buttonText: 'Register',
    });
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-8 pt-4">
          <h3>
            Meal Lists for{' '}
            {pickupDateLookup &&
              moment(state.pickupDateLookup).format('MMM Do')}{' '}
          </h3>
          <div className="lead alert alert-seconary pb-3">
            <div className="form-group">
              {showSearch && (
                <Calendar
                  onChange={(e) => onDateChange(e)}
                  tileDisabled={handleDisabledDates}
                  value={new Date()}
                />
              )}
              <button
                className="btn btn-sm btn-outline-dark"
                onClick={() => setShowSearch(!showSearch)}
              >
                <i className="far fa-calendar-alt"></i> &nbsp;&nbsp; Select Date
              </button>

              {orderType === 'Onsite' ? (
                <CSVLink
                  className="float-right"
                  headers={onsiteHeaders}
                  data={csvOnsiteData}
                >
                  Download csv
                </CSVLink>
              ) : (
                <CSVLink
                  className="float-right"
                  headers={pickupHeaders}
                  data={csvOffsiteData}
                >
                  Download csv
                </CSVLink>
              )}
              <br />
              <br />
              <input
                className="form-control pb-4"
                onChange={handleSearch(
                  'search',
                  state.search,
                  searchPickupTime,
                  searchByStatus
                )}
                value={state.search}
                type="text"
                className="form-control"
                placeholder="Search requests by pickup code"
              ></input>
              <br />
              {orderType === 'Pickup' && (
                <button
                  className="btn  btn-outline-secondary fas fa-car-side"
                  onClick={handleSearch('orderType')}
                  value="Onsite"
                >
                  &nbsp; Curbside
                </button>
              )}
              {orderType === 'Onsite' && (
                <button
                  className="btn btn-outline-secondary fas fa-school"
                  onClick={handleSearch('orderType')}
                  value="Pickup"
                >
                  &nbsp; Onsite
                </button>
              )}
              {orderType === 'Pickup' && (
                <select
                  className="btn btn-sm btn-outline-primary"
                  onChange={handleSearch(
                    'searchPickupTime',
                    state.search,
                    searchPickupTime,
                    searchByStatus
                  )}
                  value={state.searchPickupTime}
                  type="text"
                  id=""
                >
                  <option disabled value="">
                    Time
                  </option>
                  <option value="7am-9am">7-9am</option>
                  <option value="11am-1pm">11-1pm</option>
                  <option value="4pm-6pm">4-6pm</option>
                </select>
              )}
              {orderType === 'Pickup' && (
                <button
                  className=" btn btn-sm btn-outline-primary"
                  onClick={() => setShowStatus(!showStatus)}
                >
                  Show Status
                </button>
              )}
              {orderType === 'Pickup' && showStatus && (
                <select
                  className="btn btn-sm btn-outline-primary"
                  onChange={handleSearch(
                    'searchByStatus',
                    state.search,
                    searchPickupTime,
                    searchByStatus
                  )}
                  value={state.searchByStatus}
                  type="text"
                  id=""
                >
                  <option disabled value="0">
                    Status
                  </option>
                  <option value="">All</option>
                  <option value={false}>Open</option>
                  <option value={true}>Closed</option>
                </select>
              )}
              {orderType === 'Onsite' && (
                <select
                  className="btn btn-sm btn-outline-primary"
                  onChange={handleSearch(
                    'searchBySchool',
                    state.search,
                    searchPickupTime,
                    searchByStatus
                  )}
                  value={state.searchBySchool}
                  type="text"
                  id=""
                >
                  <option value="">Choose School</option>
                  <option value="BES">Brookside Elementary School</option>
                  <option value="OHES">Oak Hills Elementary School</option>
                  <option value="ROES">Red Oak Elementary School</option>
                  <option value="MCMS">Medea Creek Middle School</option>
                  <option value="OPHS">Oak Park High School</option>
                  <option value="OVHS">Oak View High School</option>
                  <option value="NON">Non OPUSD</option>
                </select>
              )}
              {orderType === 'Onsite' && (
                <select
                  className="btn btn-sm btn-outline-primary"
                  onChange={handleSearch(
                    'searchByGroup',
                    state.search,
                    searchPickupTime,
                    searchByStatus
                  )}
                  value={state.searchByGroup}
                  type="text"
                  id=""
                >
                  <option value="">Cohort A & B</option>
                  <option value="a-group">Cohort A</option>
                  <option value="b-group">Cohort B</option>
                </select>
              )}

              {orderType === 'Onsite' && (
                <>
                  {
                    <div key={2} className="">
                      {searchBySchool === 'BES' &&
                        addBESTeacher('searchByTeacher')}
                      {searchBySchool === 'OHES' &&
                        addOHESTeacher('searchByTeacher')}
                      {searchBySchool === 'ROES' &&
                        addROESTeacher('searchByTeacher')}
                      {searchBySchool === 'MCMS' &&
                        addMCMSTeacher('searchByTeacher')}
                      {searchBySchool === 'OPHS' &&
                        addOPHSTeacher('searchByTeacher')}
                      {searchBySchool === 'OVHS' &&
                        addOPHSTeacher('searchByTeacher')}
                      {searchBySchool === 'NON' &&
                        addNONTeacher('searchByTeacher')}
                    </div>
                  }

                  {searchByTeacher != '' && (
                    <div key={3} className="">
                      {searchBySchool === 'BES' &&
                        addBESTeacher('searchByTeacher2')}
                      {searchBySchool === 'OHES' &&
                        addOHESTeacher('searchByTeacher2')}
                      {searchBySchool === 'ROES' &&
                        addROESTeacher('searchByTeacher2')}
                      {searchBySchool === 'MCMS' &&
                        addMCMSTeacher('searchByTeacher2')}
                      {searchBySchool === 'OPHS' &&
                        addOPHSTeacher('searchByTeacher2')}
                      {searchBySchool === 'OVHS' &&
                        addOPHSTeacher('searchByTeacher2')}
                      {searchBySchool === 'NON' &&
                        addNONTeacher('searchByTeacher2')}
                    </div>
                  )}

                  {searchByTeacher2 != 'filter' && (
                    <div key={4} className="">
                      {searchBySchool === 'BES' &&
                        addBESTeacher('searchByTeacher3')}
                      {searchBySchool === 'OHES' &&
                        addOHESTeacher('searchByTeacher3')}
                      {searchBySchool === 'ROES' &&
                        addROESTeacher('searchByTeacher3')}
                      {searchBySchool === 'MCMS' &&
                        addMCMSTeacher('searchByTeacher3')}
                      {searchBySchool === 'OPHS' &&
                        addOPHSTeacher('searchByTeacher3')}
                      {searchBySchool === 'OVHS' &&
                        addOPHSTeacher('searchByTeacher3')}
                      {searchBySchool === 'NON' &&
                        addNONTeacher('searchByTeacher3')}
                    </div>
                  )}

                  {searchByTeacher3 != 'filter' && (
                    <div key={5} className="">
                      {searchBySchool === 'BES' &&
                        addBESTeacher('searchByTeacher4')}
                      {searchBySchool === 'OHES' &&
                        addOHESTeacher('searchByTeacher4')}
                      {searchBySchool === 'ROES' &&
                        addROESTeacher('searchByTeacher4')}
                      {searchBySchool === 'MCMS' &&
                        addMCMSTeacher('searchByTeacher4')}
                      {searchBySchool === 'OPHS' &&
                        addOPHSTeacher('searchByTeacher4')}
                      {searchBySchool === 'OVHS' &&
                        addOPHSTeacher('searchByTeacher4')}
                      {searchBySchool === 'NON' &&
                        addNONTeacher('searchByTeacher4')}
                    </div>
                  )}
                </>
              )}

              <div className="p-2"></div>

              <button
                className=" btn text-white btn-sm btn-warning"
                onClick={() => resetSearch()}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>
      <br />

      {orderType === 'Pickup'
        ? listOfLinks(state.search, searchPickupTime, searchByStatus)
        : listOfOnsiteLinks(state.search, searchPickupTime, searchByStatus)}
    </Layout>
  );
};

Requests.getInitialProps = async ({ req, user }) => {
  const token = getCookie('token', req);

  const dateLookup = moment(new Date()).format('l');
  const response = await axios.post(
    `${API}/links-by-date`,
    { dateLookup },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  let initRequests = response.data;
  return { initRequests };
};

export default withAdmin(Requests);
