
 console.log(Cookies.get('lng'))
 if(Cookies.get('lng') !='en' && Cookies.get('lng') !='fr')
{Cookies.set('lng', 'en',{ expires: 7 });}
$( document ).ready(function() {

i18next.use(window.i18nextXHRBackend)
        .init({
            debug: false,
            lng: getCookie('lng'),
            whitelist: ['fr','en'],
            fallbackLng: 'fr',
            backend: {
                loadPath: '/web/js/lang/{{lng}}/ns.json'
            }
        }, (err, t) => {
            jqueryI18next.init(i18next, $, {
                optionsAttr: 'i18n-options',
                useOptionsAttr: true,
                parseDefaultValueFromContent: true
            });
            console.log("a")
            $(document).localize();
        });
    });

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
