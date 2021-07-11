import ROUTER from 'koa-joi-router';

import HEALTH_ROUTES from './router/health';
import PURCHASE_ROUTES from './router/purchase';

class Router {
  public static initiate (): {router: ROUTER.Router} {
    const router  = ROUTER();

    router.route(HEALTH_ROUTES.read);

    router.route(PURCHASE_ROUTES.read);
    router.route(PURCHASE_ROUTES.create);

    return {router};
  };
};

export default Router;
