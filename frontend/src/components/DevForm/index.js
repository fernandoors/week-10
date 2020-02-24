import React, { useState, useEffect } from 'react';

import './style.css';

export default function DevForm({ onSubmit }) {
  const [github_username, setGithubUsername] = useState('')
  const [techs, setTechs] = useState('')
  const [lat, setLat] = useState('')
  const [long, setLong] = useState('')
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude: lat, longitude: long } = position.coords
        setLat(lat)
        setLong(long)
      },
      err => {
        console.log(err)
      },
      {
        timeout: 30000,
      }
    )
  }, [])
  async function handleSubmit(e) {
    e.preventDefault()

    await onSubmit({
      github_username,
      lat,
      long,
      techs
    })
    setGithubUsername('')
    setTechs('')
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="input-block">
        <label htmlFor='github_username'>Usuario do Github</label>
        <input
          value={github_username}
          onChange={({ target }) => setGithubUsername(target.value)}
          name='github_username'
          id='github_username'
          required />
      </div>
      <div className="input-block">
        <label htmlFor='techs'>Tecnologias</label>
        <input
          value={techs}
          onChange={({ target }) => setTechs(target.value)}
          name='techs'
          id='techs'
          required />
      </div>
      <div className="input-group">
        <div className="input-block">
          <label htmlFor='lat'>Latitude</label>
          <input type='number'
            onChange={({ target }) => setLat(target.value)}
            value={lat}
            name='lat'
            id='lat'
            required />
        </div>
        <div className="input-block">
          <label htmlFor='long'>Longitude</label>
          <input type='number'
            onChange={({ target }) => setLong(target.value)}
            value={long}
            name='long'
            id='long'
            required />
        </div>
      </div>
      <button type='submit' >Salvar</button>
    </form>
  );
}
