namespace TaskTracker.Core.Models.Identity
{
    public class IdentityResponseModel
    {
        public string UserName { get; set; }

        public string AccessToken { get; set; }

        public string RefreshToken { get; set; }

        public string[] Roles { get; set; }
    }
}
