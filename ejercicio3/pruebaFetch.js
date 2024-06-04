const api = 'api.frankfurter.app';
fetch(`https://${api}/currencies`)
  .then(resp => resp.json())
  .then((data) => {
    console.log(data);
  });