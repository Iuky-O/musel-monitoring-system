useEffect(() => {
    fetch("http://192.168.1.44:8000/exibicao/distance")
      .then(res => res.json())
      .then(data => setDistancia(data.distancia));
  }, []);