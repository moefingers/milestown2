export default function stringMatch(string1, string2) {
    return string1.toLowerCase().replace(/\s+/g, '').includes(string2.toLowerCase().replace(/\s+/g, ''));
  }