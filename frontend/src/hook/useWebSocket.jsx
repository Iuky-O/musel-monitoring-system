// import { useEffect, useState } from "react";

// function useWebSocket(url, callback) {
//     const [message, setMessage] = useState(null);
//     const [state, setState] = useState(null);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         let socket = new WebSocket(url);

//         socket.onopen = () => {
//             setLoading(false);
//         };

//         socket.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             if (data.type === "sensor_data" && data.presence) {
//                 setMessage(data);
//                 callback(data);
//             }
//         };

//         socket.onerror = (event) => {
//             setError(event.error);
//         };

//         socket.onclose = () => {
//             setTimeout(() => {
//                 socket = new WebSocket(url);
//             }, 1000);
//         };

//         return () => socket.close();
//     }, [url, callback]);

//     return { message, state, error, loading };
// }

// export default useWebSocket;

import { useEffect, useState } from "react";

function useWebSocket(url, callback) {
    const [message, setMessage] = useState(null);
    const [state, setState] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let socket = new WebSocket(url);

        socket.onopen = () => {
            setLoading(false);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "sensor_data") {
                setMessage(data);
                callback(data); // sempre chama o callback, mesmo se presence for false
            }
        };

        socket.onerror = (event) => {
            setError(event.error);
        };

        socket.onclose = () => {
            setTimeout(() => {
                socket = new WebSocket(url);
            }, 1000);
        };

        return () => socket.close();
    }, [url, callback]);

    return { message, state, error, loading };
}

export default useWebSocket;
