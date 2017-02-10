module.exports = { 
  app: {
    name: "IsItFire",
    port: {
      dev: process.env.PORT || 3000,
      deploy: 80.1
    }
  },
  firebase: {
    apiKey: "AIzaSyCEWkeZRm6n2evZXjLGSxjUhvSQfmy4KTU",
    authDomain: "adi-labs-2017.firebaseapp.com",
    databaseURL: "https://adi-labs-2017.firebaseio.com",
    storageBucket: "adi-labs-2017.appspot.com",
    messagingSenderId: "274827067296"
  },
};