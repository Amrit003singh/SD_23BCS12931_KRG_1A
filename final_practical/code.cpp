#include<iostream>
using namespace std;
class Notify{
    public:
    virtual void Notifyusers()=0;

};
class Notifyuser:public Notify{
public:
  void Notifyusers(){
      cout<<"Notified Users successfully"<<endl;
  }
};

int main(){
    Notifyuser p;
    p.Notifyusers();
    return 0;
}
