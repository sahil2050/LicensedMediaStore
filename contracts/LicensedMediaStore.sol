pragma solidity ^0.4.0;

contract LicensedMediaStore{
    struct Media{
        uint256 media_id;
        uint256 price_individual;
        uint256 price_company;
        address creator;
        string description;
        address[] stakeholders;
        uint256[] shares;
        mapping(address => string) consumers2url;
        mapping(address => string) consumer_type;
    }
    
    address[] creators;
    uint numMedia;
    mapping (uint => Media) collection;
    
    function LicensedMediaStore(address[] _creators) public {
        creators = _creators;
        numMedia = 0;
    }
    
    function isCreator(address a) public view returns (bool){
        for(uint idx = 0; idx < creators.length; idx++){
            if(a == creators[idx])return true;
        }
        return false;
    }
    
    function addMedia(uint256 _price_individual, uint256 _price_company, address _creator, string _description, address[] _stakeholders, uint256[] _shares) public returns (uint256) {
        // do necessary checks
        require(msg.sender == _creator);
        require(isCreator(_creator));
        
        uint256 media_id = ++numMedia;
        require(_stakeholders.length == _shares.length);
        require(_stakeholders.length <= 5);
        collection[numMedia] = Media(media_id, _price_individual, _price_company, _creator, _description, _stakeholders, _shares);
        return numMedia;
    }
    
    event media_item_bought(
        uint256 media_id,
        address consumer,
        bool isIndividual
    );
    
    function buyMedia(uint256 media_id, bool isIndividual) payable public returns (string){
        address buyer = msg.sender;
        uint amt_recieved = msg.value;
        Media storage media = collection[media_id];
        //check if user has already bought
        if(bytes(collection[media_id].consumers2url[msg.sender]).length != 0){
            buyer.transfer(amt_recieved);
            return "You have already purchased this media item";
        }
        //check if user has sufficient balance
        if(isIndividual){
            if(amt_recieved < media.price_individual){
                buyer.transfer(amt_recieved);
                return 'insufficient payment';
            }
            else if(amt_recieved > media.price_individual){
                buyer.transfer(amt_recieved - media.price_individual);
            }
        }else{
            if(amt_recieved < media.price_company){
                buyer.transfer(amt_recieved);
                return 'insufficient payment';
            }
            else if(amt_recieved > media.price_company){
                buyer.transfer(amt_recieved - media.price_company);
            }
        }
        emit media_item_bought(media_id, msg.sender, isIndividual);
        return 'paymnet recieved successfully';
    }
    
    event media_delivery(
        uint256 media_id,
        address consumer,
        string url
    );
    
    function addConsumer(address consumer, uint256 media_id, string url, bool isIndividual) public{
        //check that caller is indeed the creator of media
        require(msg.sender == collection[media_id].creator);
        
        collection[media_id].consumers2url[consumer] = url;
        if(isIndividual)collection[media_id].consumer_type[consumer] = 'individual';
        else collection[media_id].consumer_type[consumer] = 'company';
        emit media_delivery(media_id, consumer, url);
        
        distribute_payment(media_id, isIndividual);
    }
    
    function distribute_payment(uint256 media_id, bool isIndividual) private{
        uint256 payment = 0;
        if(isIndividual)payment = collection[media_id].price_individual;
        else payment = collection[media_id].price_individual;
        
        uint256 numPies = collection[media_id].stakeholders.length;
        uint256 total = 0;
        for(uint it = 0; it < numPies; it++){
            total += collection[media_id].shares[it];
        }
        for(it = 0; it < numPies; it++){
            uint256 pie = collection[media_id].shares[it] * payment / total;
            collection[media_id].stakeholders[it].transfer(pie);
        }
    }
    
    function getMediaUrl(uint256 media_id) public view returns (string){
        return collection[media_id].consumers2url[msg.sender];
    }
    
    function media_info(uint256 media_id) public view returns(uint256, uint256, uint256, string){
        return (collection[media_id].media_id, collection[media_id].price_individual, collection[media_id].price_company, collection[media_id].description);
    }
    
    function getNumMedia() public view returns(uint256) {
        return numMedia;
    }
}
