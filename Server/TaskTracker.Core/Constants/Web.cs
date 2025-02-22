namespace TaskTracker.Core.Constants
{
    public class Web
    {
        public class Identity
        {
            public const string AUTH_CACHE_KEY = $"AuthCache-{{0}}";

            public const string EMAIL_CACHE_KEY = $"DoesExistByEmail-{{0}}";

            public const string USERNAME_CACHE_KEY = $"DoesExistByUserName-{{0}}";
        }

        public class Task
        {
            public const string TASK_NAME_CACHE_KEY = $"DoesExistByName-{{0}}-{{1}}";

            public const string USER_TASKS_CACHE_KEY = $"Tasks-User-{{0}}";
        }
    }
}
