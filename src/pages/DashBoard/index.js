import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import socketio from 'socket.io-client';
import api from '../../services/api';

import './styles.css';

export default function Dashboard() {
    const [spots, setSpots] = useState([]);
    const [requests, setRequests] = useState([]);

    const user_id = localStorage.getItem('user');
    const socket = useMemo(() => socketio(process.env.REACT_APP_API_URL, {
        query: { user_id },
    }), [user_id]);

    useEffect(() => {


        socket.on('booking_request', data => {
            setRequests([...requests, data]);
        })

        //     socket.on('Hello', data => {
        //         console.log(data);
        //     })
        // }, []);

        // socket.emit('omni','Stack');
    }, [requests, socket]);

    useEffect(() => {
        async function loadSpots() {
            const user_id = localStorage.getItem('user');
            const response = await api.get('/dashboard', {
                headers: { user_id }
            });

            setSpots(response.data);

        }

        loadSpots();
    }, []);

    async function handleAccept(id) {
        await api.post(`/bookings/${id}/approvals`)

        setRequests(requests.filter(requests => requests._id !== id));

    }

    async function handleReject(id) {
        await api.post(`/bookings/${id}/rejections`)

        setRequests(requests.filter(requests => requests._id !== id));

    }


    return (
        <>

            <ul className="notifications">
                {requests.map(requests => (
                    <li key={requests._id}>
                        <p>
                            <strong> {requests.user.email}</strong> está solicitando uma reserva em <strong>{requests.spot.company}</strong> para a data: <strong>{requests.date}</strong>
                            <button className="accept" onClick={() => handleAccept(requests._id)}> ACEITAR </button>
                            <button className="reject" onClick={() => handleReject(requests._id)}> REJEITAR </button>
                        </p>

                    </li>
                ))}
            </ul>
            <ul className="spot-list" >
                {spots.map(spot => (
                    <li key={spot._id}>
                        <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }} />
                        <strong>{spot.company}</strong>
                        <span>{spot.price ? `RS${spot.price}/dia` : 'GRATUITO'}</span>
                    </li>
                ))}
            </ul>

            <Link to='/new'>
                <button className="btn"> cadastrar novo spot</button>
            </Link>
        </>
    )
} 