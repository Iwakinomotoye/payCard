
        const countries = [
            {
                code: "US",
                currency: "USD",
                country: 'United States'
            },
            {
                code: "NG",
                currency: "NGN",
                country: 'Nigeria'
            },
            {
                code: 'KE',
                currency: 'KES',
                country: 'Kenya'
            },
            {
                code: 'UG',
                currency: 'UGX',
                country: 'Uganda'
            },
            {
                code: 'RW',
                currency: 'RWF',
                country: 'Rwanda'
            },
            {
                code: 'TZ',
                currency: 'TZS',
                country: 'Tanzania'
            },
            {
                code: 'ZA',
                currency: 'ZAR',
                country: 'South Africa'
            },
            {
                code: 'CM',
                currency: 'XAF',
                country: 'Cameroon'
            },
            {
                code: 'GH',
                currency: 'GHS',
                country: 'Ghana'
            }
        ];
        
        const status = (response) => {
            if(response.status >= 200 && response.status < 300) {
                console.log('done');
                return Promise.resolve(response);
            } else {
                return Promise.reject(new Error(response.statusText));
            }
        }
        const appState = {};
        const formatAsMoney = (amount, buyerCountry) => {
            let specificCountry = countries[0];
            for(let i = 0; i < countries.length; i++) {
                if(buyerCountry == countries[i].country) {
                    specificCountry = countries[i];
                    break;
                }
            }
            amount = amount.toLocaleString(specificCountry.code, 
            {style: 'currency', currency: specificCountry.currency});
            return amount;
        }
    
        const flagIfInvalid = (field, isValid) => {
            if(isValid) {
                field.classList.remove('is-invalid');
            } else {
                field.classList.add('is-invalid');
            }
        }
        const expiryDateFormatIsValid = (expiryDate) => {
            expireDate = expiryDate.toString();
            if(/^\d{2}\/\d{2}$/.test(expiryDate)) {
                // console.log('true');
                return true;
            } else {
                // console.log('false');
                return false;
            }
        }
        let inputFields = document.querySelectorAll('input');
        let button = document.querySelector('.mdc-button');
        let [
                input1,
                input2,
                input3,
                input4,
                input5,
                input6
            ] = inputFields;
        const detectCardType = ({target}) => {
            let cardNumber = target.value;
            let cardColor = document.querySelector('[data-credit-card]');
            let image = document.querySelector('[data-card-type]');
            if(cardNumber[0] == '4') {
                cardColor.classList.remove('is-mastercard');
                cardColor.classList.add('is-visa');
                image.setAttribute("src", "visa.jpg");
                return 'is-visa';
            } else if (cardNumber[0] == '5') {
                cardColor.classList.remove('is-visa');
                cardColor.classList.add('is-mastercard');
                image.setAttribute("src", "MasterCard_Logo.svg.png");
                return 'is-mastercard';
            }
    
        }
    
        const validateCardExpiryDate = () => {
            let format = input6.value;
            let isValid;
            expiryDateFormatIsValid(format);
            let [ M1, M2, slash, Y1, Y2] = format;
            format = '20'+Y1+Y2+"-"+M1+M2;
            format =  new Date(format);
            let now = new Date();
            if(format > now) {
                // console.log('future');
                isValid = true;
                flagIfInvalid(input6, isValid);
                return true; 
            } else {
                // console.log('past');
                isValid = false;
                flagIfInvalid(input6, isValid);
                return false;
            }
        }
        
        const validateCardHolderName = () => {
            let format = input5.value;
            let check = /^[a-zA-Z]{3,}\s[a-zA-Z]{3,}$/.test(format);
            if(check) {
                let isValid = true;
                flagIfInvalid(input5, isValid);
                return true;
            } else {
                let isValid = false;
                flagIfInvalid(input5, isValid);
                return false;
            }
        }
        const validateWithLuhn = (digits) => {
            let regExp = /^[0-9]{16}$/;
            if(regExp.test(digits)) {
                let arr = [];
                for(let i = 0; i < digits.length; i++) {
                    let number = Number(digits[i]);
                    arr.push(number);
                }
                let arr2 = [];
                for(let j = (arr.length - 1); j >= 0; j--) {
                    let doubledElement = arr[j];
                    if(j % 2 == 0) {
                        doubledElement = arr[j] * 2;
                    }
                    if(doubledElement > 9) {
                        doubledElement = doubledElement - 9;
                    }
                    arr2.push(doubledElement);
                }
                // console.log(arr2);
                const sum = arr2.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue;
                })
                // console.log(sum);
                if(sum % 10 == 0) {
                    // console.log('correct');
                    return true;
                } else {
                    return false;
                    // console.log('lie inside')
                }
            } else {
                // console.log('lie outside');
                return false;
            }  
        }
        const link = document.querySelector('[data-link]');
        let cardDigits = document.querySelector('[data-cc-digits]');
        const validateCardNumber = () => {
            let digits = input1.value + input2.value + input3.value + input4.value;
            if(validateWithLuhn(digits)) {
                let isValid = true;
                flagIfInvalid(cardDigits, isValid);
                return true;
            } else {
                let isValid = false;
                flagIfInvalid(cardDigits, isValid);
                // console.log('lie');
                return false;
            }
        }
        const checkAll = () => {
            if(!input5.classList.contains('is-invalid') && 
                !input6.classList.contains('is-invalid') &&
                !cardDigits.classList.contains('is-invalid')) {
                    link.setAttribute("href", "pluralsight4b.html");
            } else {
               return false; 
            }
        }
        const uiCanInteract = () => {
            input1.addEventListener('blur', detectCardType);
            input5.addEventListener('blur', validateCardHolderName);
            input6.addEventListener('blur', validateCardExpiryDate);
            input4.addEventListener('blur', validateCardNumber);
            button.addEventListener('click', validateCardNumber);
            button.addEventListener('click', validateCardHolderName);
            button.addEventListener('click', validateCardExpiryDate);
            button.addEventListener('click', checkAll);
        }
        uiCanInteract();
        const displayCartTotal = ({results}) => {
            // console.log(results);
            // let [resultArray] = results;
            // let {itemsInCart, buyerCountry} = resultArray;
            // let [first, second] = itemsInCart;
            // console.log(first);
    
            // OR
    
            console.log(results);
            let [
                    {
                        itemsInCart, buyerCountry
                    }
                ] = results
            // let [first, second] = itemsInCart;
            // console.log(first);
            appState.items = itemsInCart;
            appState.country = buyerCountry;
            appState.bill = itemsInCart.reduce((accumulator, currentValue) => {
                return accumulator + (currentValue.price * currentValue.qty);
            }, 0)
            appState.billFormated = formatAsMoney(appState.bill, appState.country);
            document.querySelector('[data-bill]').innerText = appState.billFormated;
            uiCanInteract();
        }
        
        const fetchBill = () => {
            fetch('https://randomapi.com/api/006b08a801d82d0c9824dcfdfdfa3b3c')
            .then(status)
            .then(response => response.json())
            .then(data => displayCartTotal(data))
            .catch(error => console.log('Failed because: ', error));
        }
        const startApp = () => {
            fetchBill();
        };
    
        startApp();
