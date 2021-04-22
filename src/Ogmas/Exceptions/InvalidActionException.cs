using System;

namespace Ogmas.Exceptions
{
    public class InvalidActionException : Exception
    {
        public InvalidActionException(string message) : base(message) { }
    }
}