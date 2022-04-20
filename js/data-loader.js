const createGetLoader = async (url, onSuccess, onError) => {

  const fetchOptions = ({
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  });

  return await fetch(url, fetchOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`${response.status} ${response.statusText}`);
    })
    .then((data) => {
      onSuccess(data);
    })
    .catch((error) => {
      onError(error.message);
    });
};

const createPostLoader = async (url, onSuccess, onError, body) => {

  const fetchOptions = ({
    method: 'POST',
    body
  });

  return await fetch(url, fetchOptions)
    .then((response) => {
      if (response.ok) {
        return onSuccess();
      }

      throw new Error(`${response.status} ${response.statusText}`);
    })
    .catch(() => {
      onError();
    });
};

export {createGetLoader, createPostLoader};
