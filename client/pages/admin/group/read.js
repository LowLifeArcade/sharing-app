import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { API } from '../../../config';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';

const Read = ({ user, token }) => {
  const [state, setState] = useState({
    error: '',
    success: '',
    groups: [],
  });

  const { groups, error, success } = state;

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    const response = await axios.get(`${API}/groups`);
    setState({ ...state, groups: response.data });
  };

  const confirmDelete = (e, slug) => {
    e.preventDefault();
    let answer = window.confirm('WARNING! Confirm delete.');
    if (answer) {
      handleDelete(slug);
    }
  };

  const handleDelete = async (slug) => {
    try {
      const response = await axios.delete(`${API}/group/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('group DELETE SUCCESS', response);
      loadGroups();
    } catch (error) {
      console.log('ERROR DELETING group', error);
    }
  };

  const listGroups = () =>
    groups
      .slice(0)
      .reverse()
      .map((c, i) => (
        <Link key={i} href={`/admin/group/${c.slug}`}>
          <a
            href=""
            style={{
              color: 'grey',
              padding: '10px',
              boxShadow: '10px 2px 10px 4px rgba(0,0,0,0.2)',
              borderRadius: '8px',
              borderBlock: '5px',
            }}
            className="bg-light p-3 col-md-6"
          >
            <div className="row">
              <div className="col-md-3">
                {c.image && (
                  <img
                    src={c.image && c.image.url}
                    alt={c.name}
                    style={{ width: '250px', height: 'auto' }}
                  />
                )}
              </div>
              <div className="col-md-6">
                <h3>{c.name}</h3>
              </div>
              <div className="col-md-3">
                <Link href={`/admin/group/${c.slug}`}>
                  <button className="btn btn-sm btn-outline-success btn-block mb-1">
                    Update
                  </button>
                </Link>
                <button
                  onClick={(e) => confirmDelete(e, c.slug)}
                  className="btn btn-sm btn-outline-danger btn-block"
                >
                  Delete
                </button>
              </div>
            </div>
          </a>
        </Link>
      ));

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12 pt-3">
          <h1>List of Groups</h1>
          <br />
        </div>
      </div>
      <div className="row">{listGroups()} </div>
    </Layout>
  );
};

export default withAdmin(Read);
