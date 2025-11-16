# Marketplace për Biznese të Vogla në Kosovë

## Përmbledhje e Projektit
Ky projekt është një **prototip i aplikacionit mobil** i ndërtuar me **React Native duke përdorur kornizën Expo**.  
Ideja kryesore është krijimi i një **tregu digjital (marketplace)** që lidh **bizneset e vogla në Kosovë** me klientët e mundshëm, duke i lejuar ata të **promovojnë dhe shesin produktet e tyre online** në mënyrë të thjeshtë dhe moderne.

Aplikacioni ndodhet aktualisht në **fazën e parë të zhvillimit (prototip)**, duke u fokusuar në **dizajn, rrjedhën e navigimit dhe funksionalitetet bazë**, si shfaqja e produkteve, menaxhimi i shportës dhe ndërveprimi fillestar me ndërfaqen.



## Ideja e Projektit
Shumë biznese të vogla në Kosovë hasin vështirësi për shkak të **mungesës së prezencës online** dhe **mungesës së mjeteve për të ndërtuar platforma të tyre tregtare**.  
Aplikacioni ynë synon të **zgjidhë këtë problem**, duke ofruar një **marketplace të lehtë për t’u përdorur në telefon**, ku bizneset lokale mund të:

- Krijojnë profilin e tyre të biznesit  
- Ngarkojnë dhe menaxhojnë produktet  
- Arrijnë më shumë klientë vendas online  

Ndërsa klientët mund të:

- Shfletojnë produkte nga biznese të ndryshme lokale  
- Shtojnë artikuj në shportën e tyre  
- Mbështesin ndërmarrësit vendorë përmes blerjeve lokale  

Qëllimi kryesor është të **fuqizohen bizneset e vogla** dhe të kontribuohet në **zhvillimin digjital të ekonomisë së Kosovës**.


## Faza 1: Prototip (Faza 1)
Në këtë fazë, aplikacioni përfshin:

- Navigim bazë (Home, Cart, Profile)  
- Të dhëna shembull për biznese dhe produkte  
- Dizajn që përshtatet në pajisje të ndryshme  
- Prototip UI për testim dhe prezantim  



## Anëtarët e Projektit
- **Festim Gashi**  
- **Gresa Daqi**  
- **Gresa Thaçi**  
- **Grese Ferataj**  
- **Jon Jashari**  

Secili anëtar ka kontribuar në **dizajnin, zhvillimin dhe planifikimin e funksionaliteteve** të aplikacionit.



## Qëllimi
Qëllimi i këtij projekti është të **ndihmojë bizneset e vogla lokale në Kosovë të digjitalizohen**,  
duke u ofruar atyre një platformë tregtare të qasshme dhe të thjeshtë që **nuk kërkon njohuri teknike apo kosto të larta zhvillimi**.


## Shënime për zbatimin e Fazës II

- Navigimi u migrua në **Expo Router** me grupet e rrugëve `(auth)`, `(client)` dhe `(business)`.
- Autentifikimi u zbatua me **Firebase Authentication**:
- Email/fjalëkalim
- Ofruesi i Google nëpërmjet `expo-auth-session` + `GoogleAuthProvider`
- Përdorues të bazuar në role (klient/biznes) të ruajtur në koleksionin Firestore `users`.
- Shembuj Firestore CRUD:
- Bizneset mund të krijojnë dhe fshijnë produkte në koleksionin `products`.
- Klientët mund të shtojnë artikuj në nënkoleksionin e tyre `cart` dhe t'i heqin ato.
- Ndërfaqja e përdoruesit është rifreskuar me paletë të qëndrueshme jeshile/bezhë dhe navigim me skeda për secilin rol.
