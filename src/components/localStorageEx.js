const lStorageEx = () => {
  const NAMESPACE = "MY_ID";
  const TIMESTAMP = Date.now();

  if (!JSON.parse(localStorage.getItem(NAMESPACE))) {
    // when the user access your website for the first time, set the initial and expiresOn values:

    localStorage.setItem(
      NAMESPACE,
      JSON.stringify({
        initial: TIMESTAMP,
        expiresOn: TIMESTAMP + 1000 * 60 * 60 * 12, // 12 hours in ms 1000 ms * 60 s * 60 m * 24 hr
      })
    );
  } else {
    // then, when user access the website again, check the expiresOn, it it's value is bigger than current date
    const EXPIRE_DATE = JSON.parse(localStorage.getItem(NAMESPACE)).expiresOn;

    if (Date.now() > EXPIRE_DATE) {
      console.log("session expired");
    }
  }
};

export default lStorageEx;
