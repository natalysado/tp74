const http = require('http') 
const fs = require('fs') 

const mime = { 
  'html': 'text/html', 
  'css': 'text/css', 
  'jpg': 'image/jpg', 
  'ico': 'image/x-icon', 
  'mp3': 'audio/mpeg3', //lea esos tipos de archivos
  'mp4': 'video/mp4' 
} 

const servidor = http.createServer((pedido, respuesta) => { 
  const url = new URL('http://localhost:8088' + pedido.url) 
  let camino = 'public' + url.pathname 
  if (camino == 'public/') 
    camino = 'public/index.html' 
  encaminar(pedido, respuesta, camino) //para que encuentre el archivo
}) 

servidor.listen(8888) //localhost


function encaminar(pedido, respuesta, camino) { 
  console.log(camino) //la funcion
  switch (camino) { 
    case 'public/recuperardatos': { //para recuperar datos 
      recuperar(pedido, respuesta) 
      break 
    } 
    default: { 
      fs.stat(camino, error => { 
        if (!error) { 
          fs.readFile(camino, (error, contenido) => { 
            if (error) { 
              respuesta.writeHead(500, { 'Content-Type': 'text/plain' }) 
              respuesta.write('Error interno') 
              respuesta.end() 
            } else { 
              const vec = camino.split('.') 
              const extension = vec[vec.length - 1] 
              const mimearchivo = mime[extension] 
              respuesta.writeHead(200, { 'Content-Type': mimearchivo }) 
              respuesta.write(contenido) 
              respuesta.end() 
            } 
          }) 
        } else { 
          respuesta.writeHead(404, { 'Content-Type': 'text/html' }) 
          respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>') 
          respuesta.end() 
        } 
      }) 
    } 
  } //por si es error
} 


function recuperar(pedido, respuesta) { 
  let info = '' 
  pedido.on('data', datosparciales => { 
    info += datosparciales 
  }) 
  pedido.on('end', () => { 
    const formulario = new URLSearchParams(info) 
    console.log(formulario) 
    respuesta.writeHead(200, { 'Content-Type': 'text/html' }) //para que el usuario ingrese un numero

    let num = formulario.get('num'); 

    respuesta.write("<p style='text-align: center'>") 
      for (let i = 1; i <= num; i++) { 
        let espacios = "" 

        for (let j = 1; j <= num; j++) { 
          espacios += " " 
        } 

        let asteriscos = "" 

        for(let k = 1; k<=i; k++){ 
          asteriscos += "*" 

          if(k != i){ 
            asteriscos += "O" 
          } 
        } 
//para que se intercalen el * con el 0
        respuesta.write(asteriscos + "<br>") 

      } 
      respuesta.write("</p>") 
      respuesta.write("<a href='index.html'>Retornar</a>") 
      respuesta.end() 
    }) 
}