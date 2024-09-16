import { Link } from "react-router-dom"

const HomePage = () => {
  return (
    <main>
      <div className="bg-black min-w-screen min-h-screen dual-radial-gradient">

        <div className="flex justify-center py-2">
          <div className="w-full px-5 md:mx-20 lg:mx-32 flex items-center justify-between border-b-2 py-2 border-zinc-800">
            <Link to="/"><div className="font-bold text-zinc-100 text-xl lg:text-2xl font-gordita">SHIELD</div></Link>
            <Link to="/passwords"><div className="text-sm lg:text-base py-1 px-6 bg-gradient-to-r text-zinc-200 bg-zinc-700 hover:from-zinc-700 hover:to-zinc-950 font-semibold transition duration-1000 rounded-full cursor-pointer">Account</div></Link>
          </div>
        </div>

        <div className="flex-col items-center">
          <div className="my-44 lg:my-36">
          <div>
            <div className="text-center pb-4 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-zinc-300 to-zinc-600 bg-clip-text text-transparent lg:text-8xl">Security redefined.</div>
          </div>
          <div className="flex justify-center">
            <div className="w-[550px] text-center pt-2 text-xs md:text-sm  mx-12 sm:mx-32 font-semibold tracking-tight bg-gradient-to-r from-zinc-300 to-zinc-600 bg-clip-text text-transparent lg:text-lg">
              Secure your passwords, notes & personal information effortlessly with the most advanced level of security
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Link to="/auth"><div className="text-xs md:text-base py-2 px-6 bg-gradient-to-r bg-violet-700 hover:from-purple-700 hover:to-violet-950 text-white font-semibold transition duration-1000 rounded-full cursor-pointer">Get started</div></Link>
          </div>
          </div>
        </div>

      </div>

      <div className="bg-black min-w-screen min-h-screen">

        <div className="flex-col pt-14 space-y-2 items-center justify-center">
          <div className="text-center text-2xl font-bold tracking-tight text-zinc-300 sm:text-4xl">Security meets convenience</div>
          <div className="text-center pb-4 text-xs font-semibold text-zinc-400 sm:text-sm">Explore our entire security design in our white paper</div>
          <div className="flex justify-center"><a href="SHIELD-Security-Design.pdf" download="SHIELD-Security-Design.pdf" className="text-sm py-1 px-4 bg-gradient-to-r bg-violet-800 hover:bg-violet-600 text-zinc-100 font-semibold transition rounded-full cursor-pointer">Download white paper</a></div>
        </div>

        <div className="flex flex-col xl:flex-row space-y-5 xl:space-y-0 text-zinc-300 justify-between mx-5 sm:mx-10 pt-10">

          <div className="bg-primary rounded-md px-6 py-8 w-full md:w-[700px] md:mx-auto xl:mx-0 xl:w-96 xl:h-96 flex flex-col">
            <div className="font-bold text-xl sm:text-2xl mb-5 tracking-tight">Advanced Encryption Techniques</div>
            <div className="text-zinc-400 font-semibold text-base">
              Secured with AES-256 encryption and enhanced by PBKDF2 with SHA-256, delivering uncompromised protection for your data.
            </div>
            <img src="/lock.svg" alt="encryption" className="w-20 ml-auto lg:mt-auto"></img>
          </div>
          
          <div className="bg-primary rounded-md px-6 py-8 w-full md:w-[700px] md:mx-auto xl:mx-0 xl:w-96 xl:h-96 flex flex-col">
            <div className="font-bold text-xl sm:text-2xl mb-5 tracking-tight">Zero-Knowledge Architecture</div>
            <div className="text-zinc-400 font-semibold text-base">
              Powered by a zero-knowledge framework, where AES-256 encryption ensures only you can decrypt your data.
            </div>
            <img src="/key.svg" alt="encryption" className="w-20 ml-auto lg:mt-auto"></img>
          </div>

          <div className="bg-primary rounded-md px-6 py-8 w-full md:w-[700px] md:mx-auto xl:mx-0 xl:w-96 xl:h-96 flex flex-col">
            <div className="font-bold text-xl sm:text-2xl mb-5 tracking-tight">Privacy by Design, <br></br>Trust the Math</div>
            <div className="text-zinc-400 font-semibold text-base">
              Engineered with the assumption of a compromised database, our security design stands resilient, ensuring that your privacy remains intact no matter the threat.
            </div>
            <img src="/encryption.svg" alt="encryption" className="w-20 ml-auto xl:mt-auto"></img>
          </div>

        </div>

        <div className="bg-black min-w-screen min-h-screen pb-14 flex-col">
          <div className="text-center md:pt-20 text-xl sm:text-3xl mx-10 sm:mx-0 font-bold tracking-tight text-zinc-300 md:text-4xl mt-14 mb-8">SHIELD protects your most sensitive info</div>
            <div className="flex justify-center">
            <div className="bg-primary md:rounded-xl sm:mx-10 lg:mx-20 flex flex-col lg:flex-row space-y-5 lg:space-y-0">
  
              <div className="flex flex-col pl-10 lg:pl-5 pr-8 py-8 text-zinc-300 w-full lg:w-[40%] space-y-5 justify-between">
                <div className="text-xs font-semibold">PASSWORD MANAGER</div>
                <div className="space-y-2 xl:space-y-4">
                <div className="text-xl xl:text-2xl py-2 xl:py-5">Protect your passwords with a secure password manager</div>
                <div className="space-y-4 mb-5">
                  <div className="flex items-center">
                    <img src="/storage.svg" alt="storage" className="w-5 mr-2" />
                    <span className="text-sm">Store sensitive info and access it anywhere</span>
                  </div>
                  <div className="flex items-center">
                    <img src="/password.svg" alt="password" className="w-5 mr-2" />
                    <span className="text-sm">Generate strong passwords</span>
                  </div>
                  <div className="flex items-center">
                    <img src="/lock.svg" alt="lock" className="w-5 mr-2" />
                    <span className="text-sm">Take down notes privately & securely</span>
                  </div>
                  </div>
                </div>
                <Link to="/auth">
                  <div className="text-sm xl:text-base inline-block py-2 px-6 text-zinc-200 bg-violet-800 hover:bg-violet-700 font-semibold rounded-full cursor-pointer">
                    Explore password manager
                  </div>
                </Link>
              </div>
              
              <div className="relative lg:w-[60%] lg:border-l border-zinc-700">
                <img src="/shield-add-password.png" alt="shield" className="w-full h-full object-cover lg:rounded-r-xl" />
              </div>

            </div>
          </div>
        </div>

        <div className="bg-black mx-5 sm:mx-20">
          <div className="flex-col pt-8 border-t border-zinc-700">
            <div className="mb-3 text-xl font-bold tracking-tight text-zinc-400 sm:text-xl">SHIELD Password Manager</div>
            <div className="text-zinc-400 text-sm">
              SHIELD is a personal project born out of a desire for ultimate online security. 
              With AES-256 encryption, PBKDF2, and SHA-256, your passwords, notes, and personal 
              information are secured under a zero-knowledge architecture. Designed for those 
              who value privacy, SHIELD ensures that only you can access your data. It's not 
              just about protection—it's about trust, simplicity, and making sure your digital 
              life stays in your hands, where it belongs.
            </div>
          </div>
          <div className="flex justify-center space-x-10 md:space-x-16 border-b border-zinc-700 items-center py-6">
            <a href="mailto:patilom001@gmail.com" target="_blank" rel="noopener noreferrer" className=""><img src="mail.svg" alt="x.com" className="w-6"></img></a>
            <a href="https://www.linkedin.com/in/ompatil15/" target="_blank" rel="noopener noreferrer" div><img src="linkedin.svg" alt="x.com" className="bg-zinc-400 w-5"></img></a>
            <a href="https://www.github.com/ompatil-15" target="_blank" rel="noopener noreferrer"><img src="github.svg" alt="x.com" className="bg-white w-5"></img></a>
            <a href="https://x.com/cyberman_15" target="_blank" rel="noopener noreferrer"><img src="x.svg" alt="x.com" className="w-5"></img></a>
          </div>
          <div className="text-center py-5 text-zinc-400 text-base font-semibold">Om Santosh Patil</div>
          
        </div>


      </div>
      
    </main>
  )
}

export default HomePage
