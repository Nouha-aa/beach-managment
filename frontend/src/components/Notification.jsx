import React from "react";
import { useEffect } from "react";
import './Notification.css';

export default function Notification({message, onClose}) {
    //funzione per chiudere la notificazione
    useEffect(() => {8
        const timer = setTimeout(onClose, 2000);
        return () => clearTimeout(timer);
    },[onClose]);

    return (
        <div className="notification">
            {message}
        </div>
    );
};