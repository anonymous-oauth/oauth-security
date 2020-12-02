from utility.google import get_google, get_parameter, get_google_base_url, get_google_application
from domain import GoogleDomains
from tinydb import TinyDB, Query


applications = TinyDB("data/applications.json", indent=4)
db = GoogleDomains()


# Get the Google applications information
def get_google_applications(domains, update=False):
    for domain in domains:
        try:
            name = domain["domain"]
            if not applications.search(Query().domain == name) or update:
                # Get the authorization URL
                google = get_google(domain)
                url = get_google_base_url(google.get("authorization_url"))

                # Get information about the application
                app_id = get_parameter(url, "client_id")
                application = get_google_application(app_id)
                if application:
                    app_domain = {"domain": name, "application": application}
                    applications.upsert(app_domain, Query().domain == name)
                    print(app_domain)
        except Exception as e:
            print(e)


def main():
    domains = db.get_attack_domains()
    get_google_applications(domains)


if __name__ == "__main__":
    main()
