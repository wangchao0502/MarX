// check user has login
function authorize(target, name, descriptor) {
  const oldValue = descriptor.value.bind(this);

  descriptor.value = async function(ctx, next) {
    const { user } = ctx.session;

    if (user) {
      await oldValue(ctx, next);
    } else {
      ctx.redirect(`/login?redirect=${ctx.request.url}`);
    }
  };

  return descriptor;
}

export default authorize;
