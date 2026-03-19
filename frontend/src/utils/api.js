import { toast } from 'sonner';
import { ERROR_CODE } from './errorCode';

// src/utils/api.js
const BASE = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000';

const token = () => localStorage.getItem('pm_token') || '';
const auth = () => ({ Authorization: `Bearer ${token()}` });
const json = () => ({ 'Content-Type': 'application/json' });

const handle = async (res) => {
  if (!res.ok) {
    const e = await res.json();
    console.error('API error', e);
    const message = ERROR_CODE[e.errors.msg] || 'Request failed';
    toast.error(message);
    throw new Error(message);
  }
  return res.json();
};

export const api = {
  // auth
  register: (d) =>
    fetch(`${BASE}/api/user`, {
      method: 'POST',
      headers: json(),
      body: JSON.stringify(d),
    }).then(handle),
  login: (d) =>
    fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: json(),
      body: JSON.stringify(d),
      credentials: 'include',
    }).then(handle),
  logout: () =>
    fetch(`${BASE}/api/auth/logout`, {
      method: 'POST',
      headers: json(),
      credentials: 'include',
    }).then(handle),
  verify: (d) =>
    fetch(`${BASE}/api/auth/token`, {
      method: 'GET',
      headers: json(),
      credentials: 'include',
      body: JSON.stringify(d),
    }).then(handle),

  // trips
  getTrips: (params = {}) =>
    fetch(`${BASE}/api/trips?${new URLSearchParams(params)}`, {
      headers: auth(),
      credentials: 'include',
    }).then(handle),
  getMyTrips: () =>
    fetch(`${BASE}/api/trips/my-trips`, { headers: auth(), credentials: 'include' }).then(handle),
  getTrip: (id) =>
    fetch(`${BASE}/api/trips/${id}`, { headers: auth(), credentials: 'include' }).then(handle),
  createTrip: (d) =>
    fetch(`${BASE}/api/trips`, {
      method: 'POST',
      headers: { ...json(), ...auth() },
      body: JSON.stringify(d),
      credentials: 'include',
    }).then(handle),
  updateTrip: (id, d) =>
    fetch(`${BASE}/api/trips/${id}`, {
      method: 'PUT',
      headers: { ...json(), ...auth() },
      body: JSON.stringify(d),
    }).then(handle),
  deleteTrip: (id) =>
    fetch(`${BASE}/api/trips/${id}`, { method: 'DELETE', headers: auth() }).then(handle),

  // trip items
  addTripItem: (tripId, d) =>
    fetch(`${BASE}/api/trips/${tripId}/items`, {
      method: 'PATCH',
      headers: { ...json(), ...auth() },
      body: JSON.stringify(d),
    }).then(handle),
  toggleTripItem: (tripId, index, isChecked) =>
    fetch(`${BASE}/api/trips/${tripId}/items/${index}`, {
      method: 'PATCH',
      headers: { ...json(), ...auth() },
      body: JSON.stringify({ isChecked }),
    }).then(handle),
  removeTripItem: (tripId, index) =>
    fetch(`${BASE}/api/trips/${tripId}/items/${index}`, {
      method: 'DELETE',
      headers: auth(),
    }).then(handle),

  // items
  getItems: (params = {}) =>
    fetch(`${BASE}/api/items?${new URLSearchParams(params)}`, { headers: auth() }).then(handle),
  createItem: (d) =>
    fetch(`${BASE}/api/items`, {
      method: 'POST',
      headers: { ...json(), ...auth() },
      body: JSON.stringify(d),
    }).then(handle),
  updateItem: (id, d) =>
    fetch(`${BASE}/api/items/${id}`, {
      method: 'PUT',
      headers: { ...json(), ...auth() },
      body: JSON.stringify(d),
    }).then(handle),
  deleteItem: (id) =>
    fetch(`${BASE}/api/items/${id}`, { method: 'DELETE', headers: auth() }).then(handle),

  // tips
  getTips: (p = {}) =>
    fetch(`${BASE}/api/tips?${new URLSearchParams(p)}`, { headers: auth() }).then(handle),
  createTip: (d) =>
    fetch(`${BASE}/api/tips`, {
      method: 'POST',
      headers: { ...json(), ...auth() },
      body: JSON.stringify(d),
    }).then(handle),
  updateTip: (id, d) =>
    fetch(`${BASE}/api/tips/${id}`, {
      method: 'PUT',
      headers: { ...json(), ...auth() },
      body: JSON.stringify(d),
    }).then(handle),
  deleteTip: (id) =>
    fetch(`${BASE}/api/tips/${id}`, { method: 'DELETE', headers: auth() }).then(handle),
  upvoteTip: (id, email) =>
    fetch(`${BASE}/api/tips/${id}/upvote`, {
      method: 'POST',
      headers: { ...json(), ...auth() },
      body: JSON.stringify({ email }),
    }).then(handle),
  removeUpvote: (id, email) =>
    fetch(`${BASE}/api/tips/${id}/upvote`, {
      method: 'DELETE',
      headers: { ...json(), ...auth() },
      body: JSON.stringify({ email }),
    }).then(handle),

  // user
  getMe: () => fetch(`${BASE}/api/users/me`, { headers: auth() }).then(handle),
  updateMe: (d) =>
    fetch(`${BASE}/api/user`, {
      method: 'PUT',
      headers: { ...json(), ...auth() },
      body: JSON.stringify(d),
      credentials: 'include',
    }).then(handle),
};
