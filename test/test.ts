import { status } from 'minecraft-server-util';

const options = {
  enableSRV: true,
};

status('play.hypixel.net', 25565, options)
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
