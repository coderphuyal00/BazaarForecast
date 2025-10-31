from django.core.management.base import BaseCommand
from Stocks.tasks import compute_and_store_predictions

class Command(BaseCommand):
    help = 'Predict prices for all stocks'

    def handle(self, *args, **kwargs):
        # Load your 300+ stock symbols (e.g., from a file or DB)
#         stock_symbols = [
#     "ACLBSL", "ADBL", "ADBLD83", "AHL", "AHPC", "AKJCL", "AKPL", "ALBSL", "ALICL", "ANLB", "API", "AVYAN",
#     "BARUN", "BBC", "BEDC", "BFC", "BGWT", "BHDC", "BHL", "BHPL", "BNHC", "BNL", "BNT", "BPCL", "C30MF",
#     "CBBL", "CBLD88", "CCBD88", "CFCL", "CGH", "CHCL", "CHDC", "CHL", "CIT", "CITY", "CIZBD90", "CKHL",
#     "CLI", "CMF2", "CORBL", "CREST", "CYCL", "CZBIL", "DDBL", "DHPL", "DLBS", "DOLTI", "DORDI", "EBL",
#     "UMHL", "UMRH", "UNHPL", "UNL", "UNLB", "UPCL", "UPPER", "USHEC", "USHL", "USLB", "VLBS", "VLUCL",
#     "WNLB"
# ]
        stock_symbols = [
    "ACLBSL", "ADBL", "ADBLD83", "AHL", "AHPC", "AKJCL", "AKPL", "ALBSL", "ALICL", "ANLB", "API", "AVYAN"
]
        compute_and_store_predictions.delay(stock_symbols)
        self.stdout.write(self.style.SUCCESS('Started prediction task for all stocks'))