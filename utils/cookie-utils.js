export default function getCookie(cookieName) {
  const cookie = document.cookie.split(';').find((row) => row.trim().startsWith(`${cookieName}=`));
  return cookie ? cookie.split('=')[1] : null;
}
