// check user has login
function authorize(target, name, descriptor) {
  const oldValue = descriptor.value;

  descriptor.value = async(ctx, next) => {
    const { user } = ctx.session;

    if (user) {
      await oldValue(ctx, next);
    } else {
      ctx.redirect('/login');
    }
  };

  return descriptor;
}

export default authorize;
