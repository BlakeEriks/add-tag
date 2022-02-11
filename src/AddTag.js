import { useState, useEffect } from "react"
import CloseButton from "./CloseButton"
import './index.css';

/* Params For Animating Suggestion Height */
const DEFAULT_OPTIONS_HEIGHT = 188
const OPTIONS_BASE_HEIGHT = 8
const OPTION_HEIGHT = 36

/* Maximum Allowed Tags */
const MAX_TAGS = 4

/*
 *  AddTag Component
 *    created by Blake Eriks 
 *      using TailwindCSS
 */
const AddTag = () => {

  /* All Tag Options */
  const [tagOptions, setTagOptions] = useState([])
  
  /* Filtered Tag Options */
  const [filteredOptions, setFilteredOptions] = useState([])

  /* Current Tags (max 4) */
  const [tags, setTags] = useState([])

  /* Text Displayed In "Create {tag}" */
  const [newTagText, setNewTagText] = useState()

  /* Toggle Tag Options Menu */
  const [addMode, setAddMode] = useState(false)

  /* User Tag Input */
  const [tagInput, setTagInput] = useState("")

  /* For Delayed Suggestion Update */
  const [timer, setTimer] = useState()

  /* Fading Options */
  const [fadeOptions, setFadeOptions] = useState(false)

  /* Fading Tags */
  const [fadeTags, setFadeTags] = useState(new Array(5).fill(false))

  /* Fetch Tag Names On Load */
  useEffect(() => {
    const fetchTagOptions = async () => {
      const res = await fetch("http://api.open-notify.org/astros.json")
      const tags = (await res.json()).people.map(person => person.name)
      setTagOptions(tags)
      setFilteredOptions(tags.slice(2))
      setTags(tags.slice(0,2))
    }
    fetchTagOptions()
  }, [])

  /* Update Tag Options When Tags Change */
  useEffect(() => {
    updateTagOptions(tagInput)
  }, [tags])

  /* Update Tag Options */
  const updateTagOptions = (input) => {
    let newOptions = tagOptions.filter( option => (!tags.some(tag => tag === option)))
    if (input !== "") {
      newOptions = newOptions.filter(option => option.toLowerCase().includes(input.toLowerCase()))
    }
    setFilteredOptions(newOptions)
    setNewTagText(tagOptions.some(tag => tag === input) || newOptions.length > MAX_TAGS ? null : input)
  }

  /* On Tag Input, Update Tag Options After Fade */
  const onInputChange = (event) => {
    setTagInput(event.target.value)
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(setTimeout(() => {
      setFadeOptions(true)
      setTimeout(() => {
        updateTagOptions(event.target.value.trim())
        setFadeOptions(false)
      }, 75)
    }, 300))
  }

  /* Fade Out + Remove Tag */
  const removeTag = index => {
    setFadeTags([...fadeTags.slice(0,index), true, ...fadeTags.slice(index+1)])
    setTimeout(() => {
      setTags([...tags.slice(0,index), ...tags.slice(index+1)])
      setFadeTags([...fadeTags.slice(0,index), false, ...fadeTags.slice(index+1)])
    }, 300)
  }

  /* Add Tag + Clear Input */
  const addTag = tag => {
    setTags([...tags, tag])
    setTagInput("")
  }

  /* Helper For Calculating Tag Options Height */
  const getOptionsHeight = () => {
    let length = filteredOptions.length + (newTagText?.trim() ? 1 : 0)
    return OPTIONS_BASE_HEIGHT + (OPTION_HEIGHT * (length > 5 ? 5 : length))
  }

  return (
    <div className="flex flex-wrap w-full max-w-[750px] p-1 bg-white rounded-xl shadow-light text-lg">
      
      {/* List Selected Tags */}
      {tags.map( (tag, index) => (
        <div key={index} className={`${fadeTags[index] ? "opacity-0 duration-300" : ""} flex items-center bg-[#F5F7F9] rounded-md m-1 animate-fadeIn`}>
          <span className="py-[2px] pl-[8px] pr-[4px] font-medium">
            {tag}
          </span>
          <CloseButton
            onClick={() => {removeTag(index);setAddMode(false)}}
          />
        </div>
      ))}

      {/* Add Tag Sub-Component */}
      {tags.length < MAX_TAGS &&
        <div className="flex relative items-center animate-fadeIn">
          <input
            placeholder="+ Add tag" 
            className="focus:placeholder-transparent focus:outline-none caret-[#BBBBBB] p-2 w-32 text-lg font-medium"
            value={tagInput}
            maxLength={15}
            onChange={onInputChange}
            onFocus={() => setAddMode(true)}
            onBlur={() => setAddMode(false)}
          />
        
          {/* Tag Suggestions Panel */}
          {addMode &&
            <div
              className="absolute top-14 bg-white w-56 rounded-xl transition-height ease-in-out duration-300 animate-fadeIn"
              style={{height: getOptionsHeight() + "px"}}
            >
              <ul className={`${fadeOptions ? 'opacity-0 duration-75' : 'opacity-100 duration-500'} flex flex-nowrap flex-col p-1 transition-all font-medium`}>

                {/* Display Top 5 Suggestions */}
                {filteredOptions.slice(0,5).map((option, index) => (
                  <li
                    key={index}
                    className="p-1"
                  >
                    {/* onMouseDown fires before onBlur */}
                    <button onMouseDown={() => addTag(option)}>
                      {option}
                    </button>
                  </li>
                ))}

                {/* Create Tag Item */}
                { newTagText?.trim() && filteredOptions.length < 5 &&
                  <li className="p-1">
                    <button onMouseDown={() => {addTag(tagInput);setAddMode(false)}}>
                      <span className="text-[#BDBDBD] mr-1 font-medium">
                        Create
                      </span>
                      {newTagText}
                    </button>
                  </li>
                }
              </ul>
            </div>
          }
        </div>
      }
    </div>
  )
}

export default AddTag