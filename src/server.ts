import {ConfigServerType} from './types/';

import KOA from 'koa';
import MORGAN from 'koa-morgan';
import CORS from '@koa/cors';
import ROUTER from './router';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import DB from './db';
import mount from 'koa-mount';
import graphqlHTTP from 'koa-graphql';
import schema from './graphql/schema';
import HELMET from 'koa-helmet';

class Server {
  protected app: KOA;
  protected port: number;
  protected config: ConfigServerType;

  constructor (config: ConfigServerType) {
    this.app    = new KOA();
    this.port   = config.port;
    this.config = config;
  };

  protected router ():Server {
    const Router = ROUTER.initiate();
    this.app.use(mount('/graphql', graphqlHTTP({
      schema: schema,
      graphiql: true
    })))
    return this;
  };

  protected middleware ():Server {
    this.app.use(MORGAN('combined'));
    this.app.use(HELMET({
      contentSecurityPolicy: false
    }));
    this.app.use(CORS());
    this.app.use(json());
    this.app.use(bodyParser());
    return this;
  }

  protected db ():void {
    DB.connect({mongo_uri: this.config.mongo_uri});
  };

  public initiate ():Server {
    this.db();
    this.middleware();
    this.router();
    return this;
  };

  public listen ():KOA {
    this.app.listen(this.port);
    console.log(`Server is listening on port ${this.port}`);
    return this.app;
  }
};

export default Server;


