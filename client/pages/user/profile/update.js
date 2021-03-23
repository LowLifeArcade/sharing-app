import Layout from '../../../components/Layout';
import Toggle from '../../../components/Toggle';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import axios from 'axios';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import { API } from '../../../config';
import styles from '../../../styles/Home.module.css';
import { isAuth, updateUser } from '../../../helpers/auth';
import withUser from '../../withUser';
import Link from 'next/link';

const Profile = ({ user, token }) => {
  const [state, setState] = useState({
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    password: '',
    confirmPassword: '',
    error: '',
    success: '',
    buttonText: 'Update',
    addButtonText: 'Add Student',
    students: user.students,
    loadedCategories: [],
    categories: user.categories, // categories selected by user for signup
    showAllergies: [
      { showAllergey: false },
      { showAllergey: false },
      { showAllergey: false },
      { showAllergey: false },
      { showAllergey: false },
    ],
    groups: [],
    teachers: [],
    loadedGroups: [],
    loadedTeachers: [],
  });
  console.log('on load', user.students);

  const {
    showAllergies,
    addButtonText,
    students,
    name,
    teachers,
    lastName,
    email,
    password,
    confirmPassword,
    error,
    success,
    buttonText,
    loadedCategories,
    categories,
    groups,
    loadedGroups,
    loadedTeachers,
  } = state;

  // load categories when component mounts useing useEffect
  useEffect(() => {
    // loadCategories();
    loadGroups();
  }, []);

  useEffect(() => {
    success === "You've successfully updated your profile" &&
      setTimeout(() => {
        Router.push('/user');
      }, 2000);
  }, [success]);

  // useEffect(() => {
  //   // setTimeout(() => {

  //     let showAllergies = [];

  //     students.forEach((student) => {
  //       showAllergies.push({showAllergey: false})
  //     });
  //     console.log('show food allergies', showAllergies)

  //     setState({
  //       ...state,
  //       showAllergies: [... showAllergies],
  //       success: '',
  //       error: '',
  //     });
  //   // }, 100);
  // }, [students]);

  const loadGroups = async () => {
    const response = await axios.get(`${API}/groups`);
    const response2 = await axios.get(`${API}/teachers`);

    setState({
      ...state,
      loadedTeachers: response2.data,
      loadedGroups: response.data,
    });
  };
  // console.log(loadedTeachers)
  console.log('loaded groups', loadedGroups);

  // student add select THIS is where things are going to be tricky
  const handleGroupSelectChange = (e) => {
    let i = e.target.getAttribute('data-index');

    let students = [...state.students]; // spreads array from mealRequest: [] into an array called meals
    let oneStudent = { ...students[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    oneStudent.group = e.target.value;
    oneStudent.age = '';
    oneStudent.teacher = ''; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    students[i] = oneStudent; // puts meal[i] back into mealRequest array
    setState({
      ...state,
      students: [...students],
      buttonText: 'Update',
      success: '',
      error: '',
    }); //puts ...mealRequest with new meal back into mealRequest: []
  };

  // student add select THIS is where things are going to be tricky
  const handleSelectTeacherChange = (e) => {
    let i = e.target.getAttribute('data-index');

    let students = [...state.students]; // spreads array from mealRequest: [] into an array called meals
    let oneStudent = { ...students[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    oneStudent.teacher = e.target.value; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    students[i] = oneStudent; // puts meal[i] back into mealRequest array
    setState({
      ...state,
      students: [...students],
      buttonText: 'Update',
      success: '',
      error: '',
    }); //puts ...mealRequest with new meal back into mealRequest: []
  };

  // const addTeacher = (i, x) => (
  //   <>
  //     <div key={i} className="form-group">
  //       <div className="">
  //         <select
  //           value={x.teacher}
  //           data-index={i}
  //           type="select"
  //           onChange={(e) => handleSelectTeacherChange(e)}
  //           // value={state.value}
  //           // defaultValue={''}
  //           defaultValue={x.teacher}
  //           className="form-control"
  //           required
  //         >
  //           {' '}
  //           <option selected disabled value="">
  //             Choose Teacher
  //           </option>
  //           {state.loadedTeachers.map((g, i) => {
  //             return <option value={g._id}>{g.name}</option>;
  //             // return <option value={g._id}>{g.name}</option>;
  //           })}
  //         </select>
  //         <div className="p-2"></div>
  //       </div>
  //     </div>
  //   </>
  // );

  const handleObjectAgeChange = (age) => (e) => {
    let i = e.target.getAttribute('data-index');

    let students = [...state.students]; // spreads array from mealRequest: [] into an array called meals
    let oneStudent = { ...students[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    oneStudent.age = e.target.value; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    students[i] = oneStudent; // puts meal[i] back into mealRequest array

    // setState({
    //   ...state,
    //   student: [...students],
    //   buttonText: 'Register',
    //   success: '',
    //   error: '',
    // });

    setState({
      ...state,
      students: [
        ...students,
        // {
        //   name: e.target.value,
        // },
      ],
      error: '',
      success: '',
      buttonText: 'Update',
    });
  };

  const addBESTeacher = (i, x) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            value={x.teacher}
            data-index={i}
            // defaultValue={''}
            // defaultValue={state.mealRequest[0].meal}
            onChange={(e) => handleSelectTeacherChange(e)}
            className="form-control"
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
            {/* {x.schoolName === 'BES' && state.loadedTeachers.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })} */}
          </select>
          <div className="p-2"></div>
        </div>
      </div>
    </>
  );

  const addOHESTeacher = (i, x) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            // value={state.value}
            value={x.teacher}
            data-index={i}
            // defaultValue={''}
            // defaultValue={state.mealRequest[0].meal}
            onChange={(e) => handleSelectTeacherChange(e)}
            className="form-control"
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
            {/* <option value="4th-farlow">4th - Farlow</option> */}
            <option value="4th-chobanian">4th - Chobanian</option>
            <option value="5th-bailey">5th - Bailey</option>
            {/* {x.schoolName === 'BES' && state.loadedTeachers.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })} */}
          </select>
          <div className="p-2"></div>
        </div>
      </div>
    </>
  );

  const addROESTeacher = (i, x) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            // value={state.value}
            value={x.teacher}
            data-index={i}
            // defaultValue={''}
            // defaultValue={state.mealRequest[0].meal}
            onChange={(e) => handleSelectTeacherChange(e)}
            className="form-control"
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
            {/* {x.schoolName === 'BES' && state.loadedTeachers.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })} */}
          </select>
          <div className="p-2"></div>
        </div>
      </div>
    </>
  );
  const addMCMSTeacher = (i, x) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            // value={state.value}
            value={x.teacher}
            data-index={i}
            // defaultValue={''}
            // defaultValue={state.mealRequest[0].meal}
            onChange={(e) => handleSelectTeacherChange(e)}
            className="form-control"
            required
          >
            {' '}
            <option selected disabled value="">
              Choose Grade Level
            </option>
            ,<option value="6th-grade">6th </option>
            <option value="7th-grade">7th </option>
            <option value="8th-grade">8th </option>
            {/* {x.schoolName === 'BES' && state.loadedTeachers.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })} */}
          </select>
          <div className="p-2"></div>
        </div>
      </div>
    </>
  );

  const addOPHSTeacher = (i, x) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            // value={state.value}
            data-index={i}
            value={x.teacher}
            // defaultValue={''}
            // defaultValue={state.mealRequest[0].meal}
            onChange={(e) => handleSelectTeacherChange(e)}
            className="form-control"
            required
          >
            {' '}
            <option selected disabled value="">
              Choose Grade Level
            </option>
            ,<option value="9th-grade">9th</option>
            <option value="10th-grade">10th </option>
            <option value="11th-grade">11th </option>
            <option value="12th-grade">12th </option>
            {/* {x.schoolName === 'BES' && state.loadedTeachers.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })} */}
          </select>
          <div className="p-2"></div>
        </div>
      </div>
    </>
  );

  // const addOODTeacher = (i, x) => (
  //   <>
  //     <div key={i} className="form-group">
  //       <div className="">
  //         <select
  //           type="select"
  //           // value={state.value}
  //           value={x.teacher}
  //           data-index={i}
  //           // defaultValue={''}
  //           // defaultValue={state.mealRequest[0].meal}
  //           onChange={(e) => handleSelectTeacherChange(e)}
  //           className="form-control"
  //         >
  //           {' '}
  //           <option selected disabled value="">
  //             Choose Grade Level
  //           </option>
  //           ,<option value="9th-grade">9th grade</option>
  //           <option value="10th-grade">10th grade </option>
  //           <option value="11th-grade">11th grade </option>
  //           <option value="12th-grade">12th grade </option>
  //           {/* {x.schoolName === 'BES' && state.loadedTeachers.map((g, i) => {
  //             return <option value={g._id}>{g.name}</option>;
  //             // return <option value={g._id}>{g.name}</option>;
  //           })} */}
  //         </select>
  //         <div className="p-2"></div>
  //       </div>
  //     </div>
  //   </>
  // );

  // console.log(loadedGroups)
  // const addStudentGroup = (i, x) => (
  //   <>
  //     <div key={i} className="form-group">
  //       <div className="">
  //         <select
  //           value={x.group}
  //           data-index={i}
  //           onChange={(e) => handleGroupSelectChange(e)}
  //           type="select"
  //           // value={state.value}
  //           defaultValue={x.group}
  //           // defaultValue={state.mealRequest[0].meal}
  //           className="form-control"
  //           required
  //         >
  //           {/* if statement in loaded groups value bellow where if there's a value in default value then select that. Otherwise display options */}
  //           {/* {console.log('add', loadedGroups.includes(students[i].group))}{' '} */}
  //           <option selected disabled value="">
  //             Choose Student Group
  //           </option>
  //           {state.loadedGroups.map((g, i) => {
  //             return <option value={g._id}>{g.name}</option>;
  //           })}
  //         </select>
  //         <div className=""></div>
  //       </div>
  //     </div>
  //   </>
  // );

  // adding a student to fields
  const addStudent = (e) => {
    e.preventDefault();
    setState({
      ...state,
      students: [
        ...students,
        {
          name: '',
          schoolName: '',
          group: '',
          teacher: '',
          foodAllergy: {
            peanutes: false,
            treeNuts: false,
            dairy: false,
            gluten: false,
            egg: false,
            sesame: false,
            soy: false,
          },
          age: '',
        },
      ],
      showAllergies: [
        ...showAllergies,
        {
          showAllergy: false,
        },
      ],
    });
  };

  const handleObjectAllergyChange = (name) => (e) => {
    let i = e.target.getAttribute('data-index');

    let students = [...state.students]; // spreads array from mealRequest: [] into an array called meals
    let oneStudent = { ...students[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    oneStudent.foodAllergy = e.target.value; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    students[i] = oneStudent; // puts meal[i] back into mealRequest array

    // setState({
    //   ...state,
    //   student: [...students],
    //   buttonText: 'Register',
    //   success: '',
    //   error: '',
    // });

    setState({
      ...state,
      students: [...students],
      error: '',
      success: '',
      buttonText: 'Update',
    });
  };

  // remove meal button
  const removeStudent = (e) => {
    let i = e.target.getAttribute('data-index');
    e.preventDefault();

    const list = [...state.students];
    // console.log(list);
    list.splice(i, 1);
    // list.splice(index, 1);
    setState({ ...state, students: list });
  };
  // const removeStudent = (e, index) => {
  //   e.preventDefault();
  //   const list = [...state.students];
  //   // console.log(list);
  //   list.splice(-1)[0];
  //   // list.splice(index, 1);
  //   setState({ ...state, students: list });
  // };

  // should be id instead of c but it's fine
  const handleToggle = (c) => () => {
    // return the first index or -1
    const clickedCategory = categories.indexOf(c);
    const all = [...categories];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }

    // console.log('all >> categories', all);
    setState({ ...state, categories: all, success: '', error: '' });
  };

  // category checkboxes turn into select
  // const showGroups = () => {
  //   return (
  //     loadedGroups &&
  //     loadedGroups.map((c, i) => (
  //       <li className="list-unstyled" key={c._id}>
  //         <input
  //           type="checkbox"
  //           onChange={handleToggle(c._id)}
  //           className="mr-2 "
  //         />
  //         <label htmlFor="" className="form-check-label">
  //           {c.name}
  //         </label>
  //       </li>
  //     ))
  //   );
  // };

  // category checkboxes
  // const showCategories = () => {
  //   return (
  //     loadedCategories &&
  //     loadedCategories.map((c, i) => (
  //       <li className="list-unstyled" key={c._id}>
  //         <input
  //           checked={categories.includes(c._id)} // populates checked categories from registration
  //           type="checkbox"
  //           onChange={handleToggle(c._id)}
  //           className="mr-2"
  //         />
  //         <label htmlFor="" className="form-check-label">
  //           {c.name}
  //         </label>
  //       </li>
  //     ))
  //   );
  // };

  const handleChange = (name, student) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      [student]: e.target.value,
      error: '',
      success: '',
      buttonText: 'Update',
    });
  };

  const handleObjectNameChange = (name) => (e) => {
    let i = e.target.getAttribute('data-index');

    let students = [...state.students]; // spreads array from mealRequest: [] into an array called meals
    let oneStudent = { ...students[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    oneStudent.name = e.target.value; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    students[i] = oneStudent; // puts meal[i] back into mealRequest array

    setState({
      ...state,
      students: [
        ...students,
        // {
        //   name: e.target.value,
        // },
      ],
      error: '',
      success: '',
      buttonText: 'Update',
    });
  };

  const handleObjectSchoolChange = (name) => (e) => {
    let i = e.target.getAttribute('data-index');

    let students = [...state.students]; // spreads array from mealRequest: [] into an array called meals
    let oneStudent = { ...students[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    oneStudent.schoolName = e.target.value;
    oneStudent.teacher = '';
    oneStudent.age = '';
    oneStudent.group = e.target.value === 'NON' || e.target.value === 'DK' ? 'distance-learning' : '';
    // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly

    students[i] = oneStudent; // puts meal[i] back into mealRequest array

    setState({
      ...state,
      students: [
        ...students,
        // schoolName: e.target.value,
      ],
      error: '',
      success: '',
      buttonText: 'Update',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('submit', students);
    setState({ ...state, buttonText: 'Updating...' });
    // if (password !== confirmPassword) {
    //   setState({ ...state, error: "Passwords don't match" });
    //   // alert('passwords dont match')
    // } else {
    console.log('submit', user.students);

    try {
      const response = await axios.put(
        `${API}/user`,
        {
          name,
          lastName,
          email,
          students,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log('User update response', response);
      updateUser(response.data, () => {
        setState({
          ...state,
          // name: '',
          // email: '',
          // password: '',
          // confirmPassword: '',
          buttonText: 'Submitted',
          success: "You've successfully updated your profile",
          // success: response.data.message,
        });
      });
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        buttonText: 'Update failed',
        error: error.response.data.error,
      });
    }
    // }
  };

  const handleAllergy = (name) => (e) => {
    let value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    let i = e.target.getAttribute('data-index');
    console.log('let students value', e.target);

    let students = [...state.students];
    let oneStudent = { ...students[i] };
    oneStudent.foodAllergy[name] = value;
    oneStudent.foodAllergy.gluten === true ? oneStudent.group = 'distance-learning' : null

    students[i] = oneStudent;
    console.log('one student', oneStudent);

    setState({ ...state, students: [...students] });
  };

  const handleShowAllergies = (e) => {
    let i = e.target.getAttribute('data-index');

    let allShow = [...state.showAllergies];

    let showOne = { ...allShow[i] };

    showOne.showAllergy = !showOne.showAllergy;

    allShow[i] = showOne;
    console.log(allShow);

    setState({ ...state, showAllergies: [...allShow] });
  };

  const registerForm = () => (
    <form
      onSubmit={handleSubmit}
      onKeyPress={(e) => {
        if (e.key === 'Enter') e.preventDefault();
      }}
      action="POST"
    >
      {/* <div className="text-muted">First Name</div> */}
      <div className="form-group pt-2">
        <input
          value={name}
          onChange={handleChange('name')}
          type="text"
          className="form-control"
          placeholder="Enter your name"
          required
        />
      </div>
      {/* <div className="text-muted">last Name</div> */}

      <div className="form-group">
        <input
          value={lastName}
          onChange={handleChange('lastName')}
          type="text"
          className="form-control"
          placeholder="Parent Last Name"
          required
        />
      </div>

      <div className="form-group">
        <input
          value={email}
          onChange={handleChange('email')}
          type="text"
          className="form-control"
          placeholder="Type your email"
          required
          // disabled
        />
      </div>
      {
        <Link href="/auth/password/change">
          <a className="text-danger float-right">Change Password</a>
        </Link>
      }
      <br />
      {/* <div className="form-group">
        <input
          value={password}
          onChange={handleChange('password')}
          autoComplete='current-password'
          type="current-password"
          className="form-control"
          placeholder="password"
          // disabled
        />
      </div>
      <div className="form-group">
        <input
          value={confirmPassword}
          onChange={handleChange('confirmPassword')}
          type="password"
          className="form-control"
          placeholder="Repeat password"
          // required
        />
      </div> */}

      {/* <div className="text-muted">Student Name and School</div> */}

      <div className="row">
        <div className="col-md-12 pt-2">
          {students
            .slice(0)
            // .reverse()
            .map((x, i) => {
              return (
                <div key={i}>
                  <h6 className="p-2">
                    <label key={i} className="form-check-label text-muted">
                      Student # {`${i + 1}`} information
                    </label>
                  </h6>
                  {/* {console.log(x)} */}

                  <div className="form-group pt-1">
                    <input
                      value={x.name}
                      data-index={i}
                      onChange={handleObjectNameChange()}
                      // onChange={handleChange({student: 'name'})}
                      type="text"
                      className="form-control"
                      placeholder={x.name ? x.name : 'Enter student name'}
                      required
                    />
                  </div>
                  {/* <div className="form-group pt-1">
                    <input
                      value={x.foodAllergy}
                      data-index={i}
                      onChange={handleObjectAllergyChange()}
                      // onChange={handleChange({student: 'name'})}
                      type="text"
                      className="form-control"
                      placeholder="List Food Allergies (Only)"
                    />
                  </div> */}

                  <label
                    data-index={i}
                    onClick={(e) => handleShowAllergies(e)}
                    className="form btn-sm btn-outline-muted  "
                  >
                    &nbsp;&nbsp;Food Allergies? &nbsp;
                    <i
                      data-index={i}
                      onClick={(e) => handleShowAllergies(e)}
                      class="far fa-arrow-alt-circle-down"
                    ></i>
                  </label>

                  {
                    // students.length > 1 &&
                    <button
                      key={i}
                      data-index={i}
                      className="btn text-danger btn-outline-secondary float-right"
                      onClick={(e) => removeStudent(e)}
                    >
                      <i class="fas fa-user-times"></i>{' '}
                    </button>
                  }

                  <div className="pb-2"></div>
                  {showAllergies[i].showAllergy && (
                    <div className="form-control ">
                      <div className="row p-1">
                        <Toggle
                          toggleKey={i}
                          dataIndex={i}
                          isOn={students[i].foodAllergy.peanutes}
                          toggleId="peanutes"
                          toggleName="Peanutes"
                          handleToggle={handleAllergy('peanutes')}
                        ></Toggle>

                        {/* <button key={i} > test + `${i}` </button> */}
                        <Toggle
                          toggleKey={i}
                          dataIndex={i}
                          isOn={students[i].foodAllergy.treeNuts}
                          toggleId="treenuts"
                          toggleName="Tree Nuts"
                          handleToggle={handleAllergy('treeNuts')}
                        ></Toggle>

                        <Toggle
                          toggleKey={i}
                          dataIndex={i}
                          isOn={students[i].foodAllergy.dairy}
                          toggleId="dairy"
                          toggleName="Dairy"
                          handleToggle={handleAllergy('dairy')}
                        ></Toggle>

                        <Toggle
                          toggleKey={i}
                          dataIndex={i}
                          isOn={students[i].foodAllergy.gluten}
                          toggleId="gluten"
                          toggleName="Gluten"
                          handleToggle={handleAllergy('gluten')}
                        ></Toggle>

                        <Toggle
                          toggleKey={i}
                          dataIndex={i}
                          isOn={students[i].foodAllergy.egg}
                          toggleId="egg"
                          toggleName="Egg"
                          handleToggle={handleAllergy('egg')}
                        ></Toggle>

                        <Toggle
                          toggleKey={i}
                          dataIndex={i}
                          isOn={students[i].foodAllergy.sesame}
                          toggleId="sesame"
                          toggleName="Sesame"
                          handleToggle={handleAllergy('sesame')}
                        ></Toggle>

                        <Toggle
                          toggleKey={i}
                          dataIndex={i}
                          isOn={students[i].foodAllergy.soy}
                          toggleId="soy"
                          toggleName="Soy"
                          handleToggle={handleAllergy('soy')}
                        ></Toggle>
                      </div>
                    </div>
                  )}

                  <div className="form-group pt-1">
                    <select
                      value={students[i].schoolName}
                      data-index={i}
                      onChange={handleObjectSchoolChange()}
                      // onChange={handleChange({student: 'name'})}
                      type="text"
                      // defaultValue={x.schoolName}
                      className="form-control"
                      placeholder="School student attends"
                      required
                    >
                      <option value="">Choose School</option>
                      <option value="DK">Preschool</option>
                      <option value="BES">Brookside Elementary School</option>
                      <option value="OHES">Oak Hills Elementary School</option>
                      <option value="ROES">Red Oak Elementary School</option>
                      <option value="MCMS">Medea Creek Middle School</option>
                      <option value="OPHS">Oak Park High School</option>
                      <option value="OVHS">Oak View High School</option>
                      <option value="NON">Non OPUSD Student</option>
                    </select>
                  </div>

                  {students[i].schoolName != 'NON' && students[i].schoolName != 'DK' &&
                    students[i].schoolName != 'OVHS' && (
                      <div key={1} className="form-group">
                        <div className="">
                          {/* {console.log('group',x.group)} */}
                          <select
                            value={students[i].group}
                            data-index={i}
                            onChange={(e) => handleGroupSelectChange(e)}
                            type="text"
                            // value={state.value}
                            // defaultValue={x.group}
                            // defaultValue={state.mealRequest[0].meal}
                            className="form-control"
                            required
                          >
                            <option disabled value="">
                              Choose Cohort
                            </option>
                            <option value="distance-learning">
                              Distance Learning (pickup)
                            </option>
                            {students[i].foodAllergy.gluten === true ? (
                              <option disabled value="a-group">
                                A (onsite)
                              </option>
                            ) : (
                              <option value="a-group">A (onsite)</option>
                            )}
                            {students[i].foodAllergy.gluten === true ? (
                              <option disabled value="b-group">
                                B (onsite)
                              </option>
                            ) : (
                              <option value="b-group">B (onsite)</option>
                            )}
                            {/* {state.loadedGroups.map((g, i) => {
                          return (
                            <option
                              value={(g.slug)}
                            >
                              {g.name}
                            </option>
                          );
                        })} */}
                          </select>
                          <div className=""></div>
                        </div>
                      </div>
                    )}
                  {students[i].group != 'distance-learning' &&
                    students[i].schoolName != 'NON' && (
                      <div key={2} className="">
                        {x.schoolName === 'BES' && addBESTeacher(i, x)}
                        {x.schoolName === 'OHES' && addOHESTeacher(i, x)}
                        {x.schoolName === 'ROES' && addROESTeacher(i, x)}
                        {x.schoolName === 'MCMS' && addMCMSTeacher(i, x)}
                        {x.schoolName === 'OPHS' && addOPHSTeacher(i, x)}
                        {x.schoolName === 'OVHS' && addOPHSTeacher(i, x)}
                        {x.schoolName === 'NON' || x.schoolName === 'DK' && (
                          <div className="form-group pt-1">
                            <input
                              value={x.age}
                              data-index={i}
                              onChange={handleObjectAgeChange()}
                              // onChange={handleChange({student: 'name'})}
                              type="text"
                              className="form-control"
                              placeholder="Age (must be under 18)"
                              required={true}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    {students[i].schoolName === 'DK'  &&  (
                    <div className="form-group pt-1">
                      <input
                        value={x.age}
                        data-index={i}
                        onChange={handleObjectAgeChange()}
                        // onChange={handleChange({student: 'name'})}
                        type="text"
                        className="form-control"
                        placeholder="Age"
                        required={true}
                      />
                    </div>
                  )}
                  {students[i].schoolName === 'NON'  &&  (
                    <div className="form-group pt-1">
                      <input
                        value={x.age}
                        data-index={i}
                        onChange={handleObjectAgeChange()}
                        // onChange={handleChange({student: 'name'})}
                        type="text"
                        className="form-control"
                        placeholder="Age (must be under 18)"
                        required={true}
                      />
                    </div>
                  )}

                  {/* {students[i].schoolName === 'NON' && x.schoolName === 'NON' && (
                    <div className="form-group pt-1">
                      <input
                        value={x.age}
                        data-index={i}
                        onChange={handleObjectAgeChange()}
                        // onChange={handleChange({student: 'name'})}
                        type="text"
                        className="form-control"
                        placeholder="Age (must be under 18)"
                        required={true}
                      />
                    </div>
                  )} */}

                  {/* <div key={i} className="">
                    {addStudentGroup(i, x)}
                  </div> */}
                  {/* <div key={i} className="">
                    {addTeacher(i, x)}
                  </div> */}
                  {/* <div className="form-group">
        <label className="text-muted ml-3"> Student Group </label>

        <ul style={{ maxHeight: '100px', overflowY: 'scroll' }}>
          {showGroups()}
        </ul>
      </div> */}
                </div>
              );
            })}
        </div>
      </div>

      {/* {console.log('student array in state', state.students)} */}

      <div className="form-group">
        {students.length < 5 && (
          <button
            type="text"
            onClick={(e) => addStudent(e)}
            className={'btn text-dark btn-outline-secondary'}
          >
            <i class="fas fa-graduation-cap"></i> &nbsp;
            {addButtonText}
          </button>
        )}
        {/* <div className=""> */}

        {/* {students.length > 1 && (
          <button
            className="btn text-danger btn-outline-secondary float-right"
            onClick={(e) => removeStudent(e)}
          >
            <i class="fas fa-user-times"></i>{' '}
          </button>
        )} */}
        {/* </div> */}
        {/* {addStudent(i)} */}

        <div className="pt-4"></div>
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {!state.students.length < 1 && (
          <button type="text" className="btn btn-warning">
            <i className="far fa-paper-plane"></i> &nbsp;
            {buttonText}
          </button>
        )}
      </div>
    </form>
  );

  // return (
  //   <Layout>
  //     <div className="pt-4"></div>
  //     <div className={styles.subcard}>
  //       {/* + "col-md-6 offset-md-3 subcard" */}
  //       <h2 className={styles.title}>Update Profile</h2>
  //       <br />
  //       {success && showSuccessMessage(success)}
  //       {error && showErrorMessage(error)}
  //       {updateForm()}
  //     </div>
  //   </Layout>
  // );
  return (
    <div
      className={styles.background}
      style={
        {
          // height: '100vh'
        }
      }
    >
      <Layout>
        <div className={styles.body}>
          <div className="pt-5 pb-2"></div>

          {/* <div className="pt-4"></div> */}
          <div className="col-md-6 offset-md-3 pt-4">
            <div className={styles.subcard}>
              {/* + "col-md-6 offset-md-3 subcard" */}
              <h2 className={'text-muted ' + styles.title}>Update</h2>
              <br />
              {registerForm()}
              {/* {success && showSuccessMessage(success)}
    {error && showErrorMessage(error)} */}
            </div>
          </div>
        </div>
        {/* <div className="pb-4"></div> */}
      </Layout>
    </div>
  );
};

export default withUser(Profile);
