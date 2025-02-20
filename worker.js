const config = {
  theme:""//Homepage theme, use the empty value for default theme. To use urlcool theme, please fill with "theme/urlcool" .
  }
  
  const html404 = `<!DOCTYPE html>
  <body>
    <h1>404 Not Found.</h1>
    <p>The url you visit is not found.</p>
    <a href="https://github.com/xyTom/Url-Shorten-Worker/" target="_self">Fork me on GitHub</a>
  </body>
  <script>
    let goback=window.location.protocol+"//"+window.location.host;
    setInterval('window.location.replace(goback)', 5000)
  </script>`
  
  async function handleRequest(request) {  
    const requestURL = new URL(request.url)
    const path = requestURL.pathname.split("/")[1]
    const params = requestURL.search;
  
    console.log(path)
    if(!path){
  
      const html= await fetch("https://xytom.github.io/Url-Shorten-Worker/"+config.theme+"/index.html")
      
      return new Response(await html.text(), {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    })
    }
    console.log("path: "+path)

    const value = await KV.get(path);
    let location ;
  
    if(params) {
      location = value + params
    } else {
      location = value
    }
    console.log(value)
    
    if(location){
      return Response.redirect(location, 302)
    }

    // If request not in kv, return 404
    return new Response(html404, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
      status: 404
    })
  }
  
  
  addEventListener("fetch", async event => {
    event.respondWith(handleRequest(event.request))
  })
