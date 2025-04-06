useEffect(() => {
    fetch("http://192.168.1.103:8000/embarcado/ultima-distancia")
      .then(res => res.json())
      .then(data => setDistancia(data.distancia));
  }, []);
  