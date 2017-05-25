// check user has login
function authorize(target, name, descriptor) {
  const oldValue = descriptor.value;

  descriptor.value = async function(ctx, next) {
    const { user } = ctx.session;

    if (user) {
      return await oldValue.bind(this)(ctx, next);
    } else {
      ctx.redirect(`/login?redirect=${ctx.request.href}`);
    }
  };

  return descriptor;
}

export default authorize;
