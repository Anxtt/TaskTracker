namespace TaskTracker.Api.Helpers
{
    public class Collapser<TResult>
    {
        private SemaphoreSlim semaphore = new SemaphoreSlim(1, 1);
        private long windowInTicks;
        private long nextRun;
        private TResult lastResult;

        public Collapser(TimeSpan window) 
        {
            this.windowInTicks = window.Ticks;
        }

        public async Task<TResult> ExecuteAsync(
            Func<CancellationToken, Task<TResult>> func,
            CancellationToken cancellationToken)
        {
            long requestStart = DateTime.Now.Ticks;

            try
            {
                await this.semaphore.WaitAsync();

                if (requestStart <= this.nextRun)
                {
                    return this.lastResult;
                }

                this.lastResult = await func(cancellationToken);

                this.nextRun = requestStart + this.windowInTicks;
                return lastResult;
            }
            finally
            {
                this.semaphore.Release();
            }
        }
    }
}
