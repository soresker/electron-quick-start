class Commander{

    static createCommand(message) {
        return new Promise((resolve, reject) => {
            const startIndex = message.indexOf('*');
            const endIndex = message.lastIndexOf('*Z');
    
            if (startIndex === -1 || endIndex === -1) {
                reject("Geçersiz mesaj formatı");
            }
    
            const messageContent = message.substring(startIndex, endIndex-4);
    
            let utf8Bytes = unescape(encodeURIComponent(messageContent));
            let checksum = 0;
    
            for (let i = 0; i < utf8Bytes.length; i++) {
                checksum = (checksum + utf8Bytes.charCodeAt(i)) % 256;
            }
    
            const checksumValue = checksum.toString(16).toUpperCase();
            console.log("checkSum",checksumValue);
            const updatedMessage = message.replace("*Y0:", "*Y0:"+checksumValue);
            
            resolve(updatedMessage);
        });
    }

    static createMessage(action, parameters, serviceIndex) {
        return new Promise((resolve, reject) => {
            console.log("serviceIndex:",serviceIndex);

            let message = `*${action+serviceIndex}s${serviceIndex}`;
           
            if(parameters != "")
            {
                for (const key in parameters) {
                    console.log();
                    message += `*I${key}:${parameters[key]}`;
                }
            }
            message += "*Y0"; 
            message += "*Z"; // Kontrol toplamını ekledik varsayalım            
            resolve(message);
        });
    }
       
}
module.exports = Commander;


