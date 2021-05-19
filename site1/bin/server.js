const crypto = require('crypto');
let original = 'myPassword';
let test = "somePassword";

let main = async () => {

  function encryptTmp(password) {
    const algorithm = 'des-ecb';

    // use a hex key here
    const key = Buffer.from("d0e276d0144890d3", "hex");
    // const key = crypto.randomBytes(8).toString("hex");

    const cipher = crypto.createCipheriv(algorithm, key, null);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    return cipher.final('hex');
  }

  let originalEncrypted = await encryptTmp(original);
  let testEncrypted = await encryptTmp(test);
  const salt = await crypto.randomBytes(8).toString("hex");

  crypto.scrypt(originalEncrypted, salt, 64, (err, hash) => {
    // Store hash
    console.log("Password: %s hashed", original);
    crypto.scrypt(testEncrypted, salt, 64, (err, testKey) => {
      console.log("Compare password %s to %s", test, original);
      if (hash.toString('hex') == testKey.toString('hex')) {
       // Passwords match
       console.log("Match: true");
      } else {
       // Passwords don't match
       console.log("Match: false");
      }
    });
    crypto.scrypt(originalEncrypted, salt, 64, (err, originalKey) => {
      console.log("Compare password %s to %s", original, original);
      if (hash.toString('hex') == originalKey.toString('hex')) {
       // Passwords match
       console.log("Match: true");
      } else {
       // Passwords don't match
       console.log("Match: false");
      }
    });
  });
}

main();
