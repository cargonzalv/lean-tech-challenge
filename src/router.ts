import ROUTER from 'koa-joi-router';

import HEALTH_ROUTES from './router/health';

class Router {
  public static initiate (): {router: ROUTER.Router} {
    const router  = ROUTER();

    router.route(HEALTH_ROUTES.read);

    return {router};
  };
};

export default Router;
