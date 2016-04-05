def get_missing_letters(sentence):

    alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    missing_letters = [];
    
    for letter in alphabet:
        if not letter in sentence:
            missing_letters.append(letter)
    
    return ''.join(missing_letters)