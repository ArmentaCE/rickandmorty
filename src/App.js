// import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import React, { useState, useEffect } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App(){

  const [character, setCharacters] = React.useState([]);
  const [notification, setNotification] = useState(null);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Función para las notificaciones
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registrado con éxito:', registration);
        })
        .catch((error) => {
          console.error('Error al registrar el Service Worker:', error);
        });

      navigator.serviceWorker.addEventListener('message', (event) => {
        const { title, body } = event.data;
        setNotification({ title, body });
      });
    }
  }, []);


  const getCharacter = () => {

    if (
      fetch("https://rickandmortyapi.com/api/character") 
      .then((res) => res.json())
      .then((data) => 
                    setCharacters(data.results)
                    // console.log(data.results)
      )  
    ){
      if ('Notification' in window) {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            navigator.serviceWorker.ready.then((registration) => {
              registration.showNotification('¡Get Characters success!', {
                body: 'Request get done successfully',
              });
            });
          }
        });
      }
    }
  }

  const listCharacters = character.map((character) => 
    <Card key={character.id} sx={{ 
          border: 'black 1px solid',
          height: '100%',
          flexBasis: '24%',
          width: '100%', 
          margin: .5,
          '@media (max-width:1200px)':{
            flexBasis: '32%',
            width: '100%',  
          },
          '@media (max-width:800px)':{
            flexBasis: '48%',
            width: '100%', 
          },
          '@media (max-width:550px)':{
            flexBasis: '100%',
            width: '90%', 
          },
        }}>

        <CardMedia
          component="img"
          height="90%"
          width="90%"
          image={character.image}
          alt="Paella dish"
        />

        <CardContent>
        <Typography gutterBottom variant="h5" component="div">
            {character.name}{'\n'}
        </Typography>
          <Typography variant='subtitle2' color="text.secondary">
            Gender: {character.gender + '\n'}
            Location: {character.location.name} {'\n'}
            Specie: {character.species} {'\n'}
            Status: {character.status} {'\n'}
          </Typography>
        </CardContent>
      </Card> 
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color='secondary' position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Rick And Morty
          </Typography>
          <Button onClick={getCharacter} color="inherit">Get Characters</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{
          boxShadow: 'box-shadow: 3px 8px 12px -5px rgba(0,0,0,0.57); -webkit-box-shadow: 3px 8px 12px -5px rgba(0,0,0,0.57); -moz-box-shadow: 3px 8px 12px -5px rgba(0,0,0,0.57);',
          margin: 1,
          display: 'flex',
          flexWrap: 'wrap',
      }}>

      {listCharacters}

      {notification && (
        <div>
          <h2>Notificación Recibida:</h2>
          <p>{`Título: ${notification.title}`}</p>
          <p>{`Cuerpo: ${notification.body}`}</p>
        </div>
      )}
      </Box>      
    </Box>
  );
}

export default App;