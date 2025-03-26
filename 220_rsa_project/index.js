let p, q, n, phi, e = 17, d;
let plaintext = '';
let encrypted_msg = [];

// check if a number is prime
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

// generate a random prime number
function generateRandomPrime(max) {
    let prime;
    do {
        prime = Math.floor(Math.random() * (max - 2)) + 2; // random number between 2 and max
    } while (!isPrime(prime));
    return prime;
}

// compute base^expo mod p
function power(base, expo, p) {
    let res = 1;
    base = base % p;
    while (expo > 0) {
        if (expo & 1) {
            res = (res * base) % p;
        }
        expo = Math.floor(expo / 2);
        base = (base * base) % p;
    }
    return res;
}

// calculate gcd
function gcd(a, b) {
    if (b === 0) {
        return a;
    }
    return gcd(b, a % b);
}

// calculate modular inverse
function modInverse(e, phi) {
    for (let d = 1; d < phi; d++) {
        if ((e * d) % phi === 1) {
            return d;
        }
    }
    return null; // if no modular inverse exists
}

// generate primes and calculate keys
function generateKeys() {
    const maxPrime = 100 // sets max possible value for p and q
    p = generateRandomPrime(maxPrime);
    q = generateRandomPrime(maxPrime);
    n = p * q; // calculate n
    phi = (p - 1) * (q - 1); // calculate phi
    d = modInverse(e, phi);

    if (d === null) {
        alert("No valid private key found. Please try again.");
    } else {
        console.log(`Public Key: (e: ${e}, n: ${n})`);
        console.log(`Private Key: (d: ${d}, n: ${n})`);
    }
}

// call the function to generate keys on page load
generateKeys();

function encryptMessage() {
    plaintext = document.getElementById('to-encrypt').value;
    encrypted_msg = encryption(plaintext, e, n);
    document.getElementById('encrypted').value = encrypted_msg.join(', ');
}

function decryptMessage() {
    const encryptedInput = document.getElementById('to-decrypt').value.split(', ').map(Number);
    const decryptedText = decryption(encryptedInput, d, n);
    document.getElementById('decrypted').value = decryptedText;
}

// encrypt message using public key (e, n)
function encryption(msg, e, n) {
    return Array.from(msg).map(char => power(char.charCodeAt(0), e, n));
}

// decrypt message using private key (d, n)
function decryption(encrypted_text, d, n) {
    return encrypted_text.map(num => String.fromCharCode(power(num, d, n) % 256)).join('');
}