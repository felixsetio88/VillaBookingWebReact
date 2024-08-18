import { comfortable, customerservice, payment, secure } from "../assets"
import logo from "../assets/logo.png"
const callouts = [
    {
      name: 'Comfort of your home',
      description: 'Our villa was design to be as homy as possible. We promise to bring the comfort of your own home.',
      imageSrc: comfortable,
      imageAlt: '',

    },
    {
      name: 'Excellent customer service',
      description: 'If you have any questions or problem, our customer service will be ready to help.',
      imageSrc: customerservice,
      imageAlt: '',

    },
    {
      name: 'Secure booking process',
      description: "Your booking process is secured with latest security technologies, for a worry free booking experience.",
      imageSrc: secure,
      imageAlt: '',

    },
    {
        name: 'Multiple payment options',
        description: 'We are accepting multiple payment methods for easy booking.',
        imageSrc: payment,
        imageAlt: '',
      }
  ]
  
  export default function Home_whyus() {
    return (

        <div id='history' className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
            <h2 className="font-poppins text-[60px] font-bold text-gray-900"></h2>
  
            <div className="mt-6 space-y-12 lg:grid lg:grid-cols-4 lg:gap-x-6 lg:space-y-0">
              {callouts.map((callout) => (
                <div key={callout.name} className="font-poppins group relative">
                  <div className="relative h-80 w-full overflow-hidden rounded-[30px] bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                    <img
                      src={callout.imageSrc}
                      alt={callout.imageAlt}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <h3 className="mt-6 font-bold text-[16px] text-gray-900">
                    <a>
                      <span className="absolute inset-0" />
                      {callout.name}
                    </a>
                  </h3>
                  <p className="text-base font-poppins mt-6 text-gray-900">{callout.description}</p>
                </div>
              ))}
            </div>
    
        </div>
        </div>

    )
  }