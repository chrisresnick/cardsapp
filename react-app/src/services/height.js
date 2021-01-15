import { useState, useEffect } from 'react';

const useWindowHeight = () => {
    const [height, setHeight] = useState(window.innerHeight);
    const loadHeight = () => {
        setHeight(window.innerHeight)
    };
    useEffect(() => {
        window.addEventListener("resize", loadHeight);
        return (() => window.removeEventListener("resize", loadHeight));
    }, []);
    return height
}

export default useWindowHeight;
