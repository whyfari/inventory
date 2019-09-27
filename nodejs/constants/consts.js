const app = {
  port : process.env.PORT_NJS_INVENTORY || 3000,
  portAngular : process.env.PORT_NG_INVENTORY || 4200,
  hostAngular : "localhost"
}


module.exports = {app};