import React from 'react'
import { useEffect, useState, useRef } from 'react';
import axios from 'axios'
// import MapboxGL from "@react-native-mapbox-gl/maps";
import mapboxgl from 'mapbox-gl'
import {Link} from 'react-router-dom'


mapboxgl.accessToken = "pk.eyJ1Ijoic3RlcGhlbmdhbGxhZ2hlciIsImEiOiJja25mdmVwN2wxYzd0Mm9vN3A2bjV1a2U1In0.2-AsAryWffIh9UqbCHW_GQ"

export default function StudioShow(props) {

    // const mapContainer = React.createRef()

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(0);
    const [lat, setLat] = useState(0);
    const [zoom, setZoom] = useState(9);

 


    const [name, setName] = useState('')
    const [location , setLocation] = useState('')
    const [description, setDescription] = useState('')
    const [artists, setArtists] = useState([])

    // const [geometry, setGeometry] = useState({})

    const getStudio = () => {
		// get request to the server
		axios.get(`/api/crud/studio/${props.match.params.id}`)
			.then(response => {
				console.log('geography',response.data[0].geometry.coordinates);
                setName(response.data[0].name)
                setLocation(response.data[0].location)
                setDescription(response.data[0].description)
                setLng(response.data[0].geometry.coordinates[0])
                setLat(response.data[0].geometry.coordinates[1])
                // setGeometry(response.data[0].geometry)
			})
			.catch(err => console.log(err));
	}
	useEffect(() => { 
		getStudio();

	}, [])


    const getStudioArtists = () => {
		// get request to the server
		 axios.get(`/api/crud/studios/${props.match.params.id}`)
			.then(response => {
				setArtists(response.data);
                console.log('studioartists', response.data)
			})
			.catch(err => console.log(err));
	}
	useEffect(() => { 
		getStudioArtists();
	}, [])



       useEffect(() => {
        if(lng !==0 ){
        map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: 14
        });
        new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map.current)
    
    }
        }, [lat]);


        const handleSubmit = (e) => {
            e.preventDefault();
            axios.put(`/api/crud/studio/${props.match.params.id}`)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return err.response.data;
            });
        }
    

        if(mapContainer === null){
            return<></>
        }

        if(name === '') {
            return <></>
        }

    return (

        <div>

            <div className="row">
            <div className="col-6">
            <div className="sidebar">
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
                <div ref={mapContainer} className="mapContainer" style={{height:"300px", width:"300px"}}/>
            </div>
           
            
            <div className="col-6">
            <h1>{name}</h1>
            <h2>{location}</h2>
            <p>{description}</p>
            <form onSubmit={handleSubmit}>
                <button type="submit" className="btn btn-primary">Join this studio</button>
            </form>
            </div>
            <h4>Artists at this studio</h4>
            <div className="d-flex flex-wrap">
            {artists.map(artist => {
                    return (
                        
                            <div className="p-5">
                                <Link to={`/${artist._id}/artist-profile`}>
                                  <img className="artist-image rounded border border-dark shadow" src={artist.profilePicture} style={{width: "200px", height: "300px"}}></img>
                                    <p> {artist.firstName} {artist.lastName}</p>
                                </Link> 
                          
                        </div>
                    )
                })
             }
             </div>

      


            
         
            </div>
        </div>
    )
}
