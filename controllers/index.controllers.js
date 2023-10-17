// const indexController = {}
// indexController.listar = async (req, res, next) => {
export const listar = async (req, res, next) => {
  // res.render('index', { title: 'Applocation' });
  res.render('index.html');
  // res.sendFile('../index.html')
}

// export default { indexController } 
// Error: Route.get() requires a callback function but got a [object Undefined]
// export default { listar };