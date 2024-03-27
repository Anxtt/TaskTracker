namespace TaskTracker.Core.Constants
{
    public class Web
    {
        public class Identity
        {
            public const string AUTH_CACHE_KEY = $"AuthCache-{{0}}";

            public const string EMAIL_CACHE_KEY = $"DoesExistByEmail-{{0}}";
        }

        public class Task
        {
            public const string TASK_NAME_CACHE_KEY = $"DoesExistByEmail-{{0}}-{{1}}";
        }
    }
}
