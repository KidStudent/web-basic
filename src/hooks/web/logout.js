import user from '@/config/api/user';
import axios from '@/config/http/http';
export async function logOutHook() {
  try {
    await axios.delete(user.logout);
    window.sessionStorage.clear();
    setTimeout(() => {
      window.location.reload();
    });
  } catch (err) {
    console.log(err);
  }
}
