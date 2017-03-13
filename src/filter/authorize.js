// check user has login
function authorize(target, name, descriptor) {
  const oldValue = descriptor.value;

  descriptor.value = async function(ctx, next) {
    const { user } = ctx.session;

    if (user) {
      await oldValue.bind(this)(ctx, next);
    } else {
      console.log(ctx.request);
      ctx.redirect(`/login?redirect=${ctx.request.href}`);
    }
  };

  return descriptor;
}

export default authorize;
