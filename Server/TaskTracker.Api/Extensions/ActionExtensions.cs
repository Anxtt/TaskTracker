namespace TaskTracker.Api.Extensions
{
    public static class ActionExtensions
    {
        public static Action Debounce(this Action action, TimeSpan delay)
        {
            CancellationTokenSource? token = null;

            return () =>
            {
                token?.Cancel();
                token = new CancellationTokenSource();

                Task
                    .Delay(delay)
                    .ContinueWith(x =>
                    {
                        if (x.IsCompletedSuccessfully == true)
                        {
                            action();
                        }
                    }, TaskScheduler.Default);
            };
        }
    }
}
