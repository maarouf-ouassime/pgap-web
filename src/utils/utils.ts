export class Utils {

  token = sessionStorage.getItem('auth-user');
  errorLoadingImg = [];

  imgError(item: { id: string | number; }): void {
    console.log('invoked img error');
    console.log(item.id);
    // @ts-ignore
    this.errorLoadingImg[item.id] = true;
  }

  // Show time notification from created date:
  // @ts-ignore
  getTimeNotification(dateNotif: string | number | Date): string {
    const dateNow = new Date();
    if (dateNotif && dateNow) {
      // this.dateNow.setUTCHours(this.dateNow.getHours());
      const seconds = Math.floor((+dateNow.getTime() - new Date(dateNotif).getTime()) / 1000);
      let interval = seconds / 31536000;
      if (interval < 0) {
        return '';
      } else {
        if (interval > 1) {
          return Math.floor(interval) + ' Year(s)';
        }
        interval = seconds / 2592000;
        if (interval > 1) {
          return Math.floor(interval) + ' Month(s)';
        }
        interval = seconds / 86400;
        if (interval > 1) {
          return Math.floor(interval) + ' Day(s)';
        }
        interval = seconds / 3600;
        if (interval > 1) {
          return Math.floor(interval) + 'h';
        }
        interval = seconds / 60;
        if (interval > 1) {
          return Math.floor(interval) + 'min';
        }
        return Math.floor(seconds) + 'sec';
      }
    }
  }
}
