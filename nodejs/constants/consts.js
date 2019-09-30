const app = {
  port : process.env.PORT_NJS_INVENTORY || 3000,
  portAngular : process.env.PORT_NG_INVENTORY || 4200,
  hostAngular : "localhost"
}

const cHttp= {
/*
  Informational responses (100–199),
  Successful responses (200–299),
  Redirects (300–399),
  Client errors (400–499),
  and Server errors (500–599)
*/

  Cont: 100,               // Continue

  OK : 200,                // ok
  Created: 201,            // created, for POST/PUT
  Accepted: 202,           // accepted (but not acted on yet)
  NoCont: 204,             // no content
  ResetCont: 205,          // reset content
  PartCont: 206,           // partial content

  BadReq: 400,             // bad request (invalid syntax)
  UnAuth: 401,             // unauthorized/unauthenticated (client is not known)
  Forbidden: 403,          // forbidden (client is known)
  NotFound: 404,           // (URL) not found or endpoint valid but resource DNE
  NotAllowed: 403,         // method not allowed (ex you can't DELETE a sources)
  ReqTimeout: 408,         // timed out waiting
  Conflict: 409,           // req not processed; conflict in state of resource
  Gone : 410,              // content has been permanently deleted
  TeaPot : 418,            // I'm a teapot
  Unprocessable: 422,      // Unprocessable entity
  Locked: 423,             // resource being accessed is locked
  TooManyReq: 429,         // too many requests in given amount of time

  IntServerErr: 500,       // internal server error
  NotImpl: 501,            // not implemented
  SerUnavailable: 503,     // service unavailable
  NetworkAuthReq: 511,     // network authentication required

}

module.exports = {app, cHttp};